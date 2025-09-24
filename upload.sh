#!/bin/bash

# Upload script for ROQ UI Interface
# Usage: ./upload.sh [file_to_upload] [remote_path]

# Configuration
SSH_KEY="id_rsa_peridot.key"
SERVER="root@192.168.1.117"
REMOTE_BASE_PATH="/var/www"
TEMP_DIR="/tmp/roq_upload_$$"

# Overwrite behavior: force, no-overwrite, interactive
OVERWRITE_MODE="force"
# Extract behavior: true = extract directly to target, false = create subdirectory
EXTRACT_DIRECT=false

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [file_to_upload] [remote_path]"
    echo ""
    echo "Examples:"
    echo "  $0 test-api.html                    # Upload single file to /var/www/"
    echo "  $0 project.zip /var/www/roq        # Upload and extract zip to specific path"
    echo "  $0 WebContent/ /var/www/           # Upload entire WebContent directory"
    echo ""
    echo "Options:"
    echo "  -h, --help     Show this help message"
    echo "  -d, --dry-run  Show what would be uploaded without actually uploading"
    echo "  -f, --force    Force overwrite existing files (default behavior)"
    echo "  -n, --no-overwrite  Skip files that already exist on server"
    echo "  -i, --interactive  Ask before overwriting each file"
    echo "  -e, --extract-direct  Extract zip contents directly to target directory"
}

# Function to check if file exists
check_file() {
    if [ ! -e "$1" ]; then
        print_error "File or directory '$1' does not exist!"
        exit 1
    fi
}

# Function to check if file exists on server
check_remote_file() {
    local remote_file="$1"
    ssh -i "$SSH_KEY" "$SERVER" "test -f '$remote_file'" 2>/dev/null
    return $?
}

# Function to handle file overwrite decision
should_overwrite() {
    local local_file="$1"
    local remote_file="$2"
    local rel_path="$3"
    
    case "$OVERWRITE_MODE" in
        "force")
            return 0  # Always overwrite
            ;;
        "no-overwrite")
            return 1  # Never overwrite
            ;;
        "interactive")
            echo -n "File '$rel_path' already exists on server. Overwrite? (y/N): "
            read -r response
            case "$response" in
                [yY]|[yY][eE][sS])
                    return 0
                    ;;
                *)
                    return 1
                    ;;
            esac
            ;;
        *)
            return 0  # Default to force
            ;;
    esac
}

# Function to upload single file
upload_single_file() {
    local file="$1"
    local remote_path="$2"
    local remote_file="$remote_path/$(basename "$file")"
    
    # Check if file exists on server
    if check_remote_file "$remote_file"; then
        if ! should_overwrite "$file" "$remote_file" "$(basename "$file")"; then
            print_warning "Skipping existing file: $(basename "$file")"
            return 0
        fi
    fi
    
    print_status "Uploading single file: $file"
    
    if scp -i "$SSH_KEY" -O "$file" "$SERVER:$remote_path"; then
        print_status "Successfully uploaded $file to $remote_path"
    else
        print_error "Failed to upload $file"
        return 1
    fi
}

# Function to upload directory recursively file by file
upload_directory() {
    local local_dir="$1"
    local remote_dir="$2"
    
    print_status "Uploading directory file by file: $local_dir"
    
    # Find all files in the directory and upload them one by one
    while IFS= read -r -d '' file; do
        # Get relative path from local_dir
        local rel_path="${file#$local_dir/}"
        local remote_file_path="$remote_dir/$rel_path"
        local remote_file_dir="$(dirname "$remote_file_path")"
        
        # Create remote directory if it doesn't exist
        print_status "Creating remote directory: $remote_file_dir"
        ssh -i "$SSH_KEY" "$SERVER" "mkdir -p '$remote_file_dir'"
        
        # Check if file exists on server and handle overwrite
        if check_remote_file "$remote_file_path"; then
            if ! should_overwrite "$file" "$remote_file_path" "$rel_path"; then
                print_warning "Skipping existing file: $rel_path"
                continue
            fi
        fi
        
        # Upload the file
        print_status "Uploading: $rel_path"
        if scp -i "$SSH_KEY" -O "$file" "$SERVER:$remote_file_path"; then
            print_status "✓ Successfully uploaded: $rel_path"
        else
            print_error "✗ Failed to upload: $rel_path"
            return 1
        fi
    done < <(find "$local_dir" -type f -print0)
    
    print_status "Successfully uploaded all files from directory $local_dir to $remote_dir"
}

# Function to upload and extract zip file
upload_and_extract_zip() {
    local zip_file="$1"
    local remote_path="$2"
    local zip_name="$(basename "$zip_file")"
    local zip_basename="${zip_name%.*}"
    
    print_status "Uploading zip file: $zip_file"
    
    # Upload zip file
    if scp -i "$SSH_KEY" -O "$zip_file" "$SERVER:$remote_path"; then
        print_status "Successfully uploaded zip file"
    else
        print_error "Failed to upload zip file"
        return 1
    fi
    
    # Extract zip file on server with proper overwrite handling
    print_status "Extracting zip file on server..."
    
    # Create extraction command based on overwrite mode and extract behavior
    local extract_cmd=""
    
    if [ "$EXTRACT_DIRECT" = true ]; then
        # Extract directly to target directory, preserving directory structure
        case "$OVERWRITE_MODE" in
            "force")
                extract_cmd="cd $remote_path && unzip -o $zip_name && if [ -d $zip_basename ]; then cp -r $zip_basename/* . && rm -rf $zip_basename; fi && rm $zip_name"
                ;;
            "no-overwrite")
                extract_cmd="cd $remote_path && unzip -n $zip_name && if [ -d $zip_basename ]; then cp -r $zip_basename/* . && rm -rf $zip_basename; fi && rm $zip_name"
                ;;
            "interactive")
                extract_cmd="cd $remote_path && echo 'Extracting zip contents directly to $remote_path. Continue? (y/N):' && read -r response && if [[ \$response =~ ^[yY] ]]; then unzip -o $zip_name && if [ -d $zip_basename ]; then cp -r $zip_basename/* . && rm -rf $zip_basename; fi && rm $zip_name; else echo 'Skipping extraction...' && rm $zip_name; fi"
                ;;
            *)
                extract_cmd="cd $remote_path && unzip -o $zip_name && if [ -d $zip_basename ]; then cp -r $zip_basename/* . && rm -rf $zip_basename; fi && rm $zip_name"
                ;;
        esac
    else
        # Extract to subdirectory
        case "$OVERWRITE_MODE" in
            "force")
                extract_cmd="cd $remote_path && rm -rf $zip_basename && unzip -o $zip_name && rm $zip_name"
                ;;
            "no-overwrite")
                extract_cmd="cd $remote_path && if [ ! -d $zip_basename ]; then unzip -o $zip_name && rm $zip_name; else echo 'Directory $zip_basename already exists, skipping...' && rm $zip_name; fi"
                ;;
            "interactive")
                extract_cmd="cd $remote_path && if [ -d $zip_basename ]; then echo 'Directory $zip_basename already exists. Overwrite? (y/N):' && read -r response && if [[ \$response =~ ^[yY] ]]; then rm -rf $zip_basename && unzip -o $zip_name && rm $zip_name; else echo 'Skipping extraction...' && rm $zip_name; fi; else unzip -o $zip_name && rm $zip_name; fi"
                ;;
            *)
                extract_cmd="cd $remote_path && rm -rf $zip_basename && unzip -o $zip_name && rm $zip_name"
                ;;
        esac
    fi
    
    if ssh -i "$SSH_KEY" "$SERVER" "$extract_cmd"; then
        print_status "Successfully extracted and removed zip file"
    else
        print_error "Failed to extract zip file on server"
        return 1
    fi
}

# Function to create temporary zip from directory
create_temp_zip() {
    local source_dir="$1"
    local zip_file="$2"
    
    print_status "Creating temporary zip file from directory: $source_dir"
    
    if zip -r "$zip_file" "$source_dir" > /dev/null 2>&1; then
        print_status "Created temporary zip: $zip_file"
        return 0
    else
        print_error "Failed to create zip file"
        return 1
    fi
}

# Main function
main() {
    local file_to_upload=""
    local remote_path="$REMOTE_BASE_PATH"
    local dry_run=false
    
    # Parse arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                show_usage
                exit 0
                ;;
            -d|--dry-run)
                dry_run=true
                shift
                ;;
            -f|--force)
                OVERWRITE_MODE="force"
                shift
                ;;
            -n|--no-overwrite)
                OVERWRITE_MODE="no-overwrite"
                shift
                ;;
            -i|--interactive)
                OVERWRITE_MODE="interactive"
                shift
                ;;
            -e|--extract-direct)
                EXTRACT_DIRECT=true
                shift
                ;;
            *)
                if [ -z "$file_to_upload" ]; then
                    file_to_upload="$1"
                elif [ "$remote_path" = "$REMOTE_BASE_PATH" ]; then
                    remote_path="$1"
                fi
                shift
                ;;
        esac
    done
    
    # Check if file is provided
    if [ -z "$file_to_upload" ]; then
        print_error "No file or directory specified!"
        show_usage
        exit 1
    fi
    
    # Check if file exists
    check_file "$file_to_upload"
    
    # Dry run mode
    if [ "$dry_run" = true ]; then
        print_warning "DRY RUN MODE - No files will be uploaded"
        echo "Overwrite mode: $OVERWRITE_MODE"
        if [ "$EXTRACT_DIRECT" = true ]; then
            echo "Extract mode: Direct to target directory"
        else
            echo "Extract mode: Create subdirectory"
        fi
        if [ -f "$file_to_upload" ]; then
            if [[ "$file_to_upload" == *.zip ]]; then
                if [ "$EXTRACT_DIRECT" = true ]; then
                    echo "Would upload and extract zip file directly to: $remote_path"
                else
                    echo "Would upload and extract zip file to subdirectory: $remote_path/$(basename "${file_to_upload%.*}")"
                fi
            else
                echo "Would upload single file: $file_to_upload to $remote_path"
            fi
        elif [ -d "$file_to_upload" ]; then
            echo "Would upload directory file by file: $file_to_upload to $remote_path"
            echo "Files to be uploaded:"
            find "$file_to_upload" -type f | while read -r file; do
                local rel_path="${file#$file_to_upload/}"
                echo "  - $rel_path"
            done
        fi
        exit 0
    fi
    
    # Create remote directory if it doesn't exist
    print_status "Ensuring remote directory exists: $remote_path"
    ssh -i "$SSH_KEY" "$SERVER" "mkdir -p $remote_path"
    
    # Determine upload method based on file type
    if [ -f "$file_to_upload" ]; then
        if [[ "$file_to_upload" == *.zip ]]; then
            upload_and_extract_zip "$file_to_upload" "$remote_path"
        else
            upload_single_file "$file_to_upload" "$remote_path"
        fi
    elif [ -d "$file_to_upload" ]; then
        # For directories, upload each file individually
        upload_directory "$file_to_upload" "$remote_path"
    else
        print_error "Invalid file type: $file_to_upload"
        exit 1
    fi
    
    print_status "Upload completed successfully!"
}

# Run main function with all arguments
main "$@"


## Examples usage
# ./upload.sh --interactive --extract-direct build.zip /var/www