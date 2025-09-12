import logging
from typing import Optional, Any, List, TypedDict
import requests

# SWITCH_DYNAMIC_TYPES_BEGIN

user_login_parameters = TypedDict("user_login_parameters", {'user': str, 'password': str})
user_change_user_password_parameters = TypedDict("user_change_user_password_parameters", {'user': str, 'password': str})
user_add_user_parameters = TypedDict("user_add_user_parameters", {'user': str, 'password': str, 'level': int})
user_remove_user_parameters = TypedDict("user_remove_user_parameters", {'user': str})
system_set_info_parameters = TypedDict("system_set_info_parameters", {'description': str, 'contact': str, 'location': str})
system_apply_config_parameters = TypedDict("system_apply_config_parameters", {'roqs-container': dict})
system_validate_config_base64_parameters = TypedDict("system_validate_config_base64_parameters", {'roqs-container': dict})
system_apply_config_base64_parameters = TypedDict("system_apply_config_base64_parameters", {'roqs-container': dict})
system_apply_and_save_config_parameters = TypedDict("system_apply_and_save_config_parameters", {'roqs-container': dict})
system_save_config_with_name_parameters = TypedDict("system_save_config_with_name_parameters", {'cfgName': str})
system_files_parameters = TypedDict("system_files_parameters", {'webexport': bool})
snmp_set_config_parameters = TypedDict("snmp_set_config_parameters", {'v1': bool, 'v2c': bool, 'v3': bool, 'read_community': str, 'write_community': str, 'engineID': str})
snmp_add_user_parameters = TypedDict("snmp_add_user_parameters", {'name': str, 'authpass': str, 'privpass': str})
interface_set_interfaces_parameters = TypedDict("interface_set_interfaces_parameters", {'interface': int, 'name': str, 'up': bool, 'autoneg': bool, 'speed': int, 'duplex': bool})
interface_set_bsp_state_parameters = TypedDict("interface_set_bsp_state_parameters", {'bsp': bool})
vlan_set_vlan_interfaces_parameters = TypedDict("vlan_set_vlan_interfaces_parameters", {'interface': int, 'tags': int, 'discardtagged': bool, 'discarduntagged': bool, 'forcedefaultvid': bool})
vlan_add_vids_parameters = TypedDict("vlan_add_vids_parameters", {'vid': int, 'name': str})
vlan_set_vid_members_parameters = TypedDict("vlan_set_vid_members_parameters", {'vid': int, 'members': list})
vlan_set_bridges_parameters = TypedDict("vlan_set_bridges_parameters", {'wan': bool, 'vid': int, 'ip': str, 'sm': str, 'gw': str, 'forward': bool, 'proxy_arp': bool})
vlan_set_bridge_temporary_parameters = TypedDict("vlan_set_bridge_temporary_parameters", {'wan': bool, 'vid': int, 'ip': str, 'sm': str, 'gw': str})
vlan_set_global_vlans_parameters = TypedDict("vlan_set_global_vlans_parameters", {'enable': bool})
lldp_set_interfaces_parameters = TypedDict("lldp_set_interfaces_parameters", {'interface': int, 'tx': bool})
dhcpv1_set_config_parameters = TypedDict("dhcpv1_set_config_parameters", {'state': bool, 'subnetmask': str, 'gateway': str, 'dns': list, 'domain': str, 'lease time': int, 'bridge': dict})
dhcpv1_add_static_leases_parameters = TypedDict("dhcpv1_add_static_leases_parameters", {'mac': str, 'ip': str})
dhcpv1_remove_static_leases_parameters = TypedDict("dhcpv1_remove_static_leases_parameters", {'mac': str, 'ip': str})
dhcpv1_set_port_based_parameters = TypedDict("dhcpv1_set_port_based_parameters", {'interface': int, 'ip': str})
dhcpv1_get_port_ip_parameters = TypedDict("dhcpv1_get_port_ip_parameters", {'mac': str})
dhcpv1_set_pool_parameters = TypedDict("dhcpv1_set_pool_parameters", {'pool start': str, 'pool end': str})
mirroring_set_mirroring_parameters = TypedDict("mirroring_set_mirroring_parameters", {'src': list, 'dest': int})
qos_set_defaults_parameters = TypedDict("qos_set_defaults_parameters", {'interface': int, 'prio choice': str, 'queue': int, 'pcp': int})
igmp_set_bridge_parameters = TypedDict("igmp_set_bridge_parameters", {'bridge': dict, 'snooper': bool, 'querier': bool, 'version': int, 'interval': int, 'timeout': int})
igmp_set_router_ports_parameters = TypedDict("igmp_set_router_ports_parameters", {'ports': list})
poe_set_port_cfg_state_parameters = TypedDict("poe_set_port_cfg_state_parameters", {'name': str, 'enable': bool, 'limit': int, 'limit_pwr': int, 'prio': int, 'fault': bool})
production_upload_configuration_parameters = TypedDict("production_upload_configuration_parameters", {'name': str, 'type': str, 'content': dict})
production_download_configuration_parameters = TypedDict("production_download_configuration_parameters", {'name': str})
production_apply_configuration_parameters = TypedDict("production_apply_configuration_parameters", {'name': str})
dhcpclient_all_parameters = TypedDict("dhcpclient_all_parameters", {'id': int, 'operation': bool, 'provision': bool, 'filter': bool})
stp_set_stp_version_parameters = TypedDict("stp_set_stp_version_parameters", {'lan': str, 'lanprio': int})
ntp_set_config_parameters = TypedDict("ntp_set_config_parameters", {'enable': bool, 'server': str, 'queryInterval': int})
trap_set_trap_parameters = TypedDict("trap_set_trap_parameters", {'version': str, 'community': str, 'destination': str, 'enabled': bool})
log_set_remote_parameters = TypedDict("log_set_remote_parameters", {'enabled': bool, 'destination': str, 'protocol': str, 'port': int, 'mark': bool, 'interval': int})
mqtt_set_mqtt_parameters = TypedDict("mqtt_set_mqtt_parameters", {'enabled': bool, 'update_topic': str, 'server': str, 'port': int, 'qos': int, 'tls': bool, 'name': str, 'update_enabled': bool, 'verify': bool, 'ca_cert': str, 'username': str, 'password': str, 'pingreq_interval': int})
staticmc_add_entry_parameters = TypedDict("staticmc_add_entry_parameters", {'mac': str, 'vid': int, 'cpu': bool, 'ports': list, 'description': str})
staticmc_remove_entry_parameters = TypedDict("staticmc_remove_entry_parameters", {'mac': str, 'vid': int})
dhcp_set_vids_parameters = TypedDict("dhcp_set_vids_parameters", {'type': str, 'vid': int})
dhcp_remove_cfg_leases_parameters = TypedDict("dhcp_remove_cfg_leases_parameters", {'ip': str})
dhcp_add_cfg_leases_parameters = TypedDict("dhcp_add_cfg_leases_parameters", {'ip': str, 'type': int, 'value': list, 'options': list})
dhcp_set_subnet_parameters = TypedDict("dhcp_set_subnet_parameters", {'ip': str, 'mask': str, 'leasetime': int, 'pool_start': str, 'pool_end': str, 'options': list})
dhcp_remove_subnet_parameters = TypedDict("dhcp_remove_subnet_parameters", {'ip': str, 'mask': str})
dhcp_edit_subnet_parameters = TypedDict("dhcp_edit_subnet_parameters", {'ip': str, 'mask': str, 'leasetime': int, 'pool_start': str, 'pool_end': str, 'options': list})
dhcpv2_subnets_parameters = TypedDict("dhcpv2_subnets_parameters", {'add': list, 'upd': list, 'del': list})
vlan_set_set_bridges_parameters = TypedDict("vlan_set_set_bridges_parameters", {'wan': bool, 'vid': int, 'ip': str, 'sm': str, 'gw': str, 'forward': bool, 'proxy_arp': bool, 'dhcp_client': bool, 'dhcp_provision': bool, 'dhcp_filter': bool})
vlan_set_add_vlan_id_parameters = TypedDict("vlan_set_add_vlan_id_parameters", {'vlan_id': int, 'name': str})
vlan_set_remove_vlan_id_parameters = TypedDict("vlan_set_remove_vlan_id_parameters", {'vlan_id': int})
nat_set_state_parameters = TypedDict("nat_set_state_parameters", {'enabled': bool})
nat_add_rule_parameters = TypedDict("nat_add_rule_parameters", {'name': str, 'FORWARD': list, 'PREROUTING': list, 'POSTROUTING': list, 'ips': list})
nat_remove_rule_parameters = TypedDict("nat_remove_rule_parameters", {'index': int})
ignition_set_settings_parameters = TypedDict("ignition_set_settings_parameters", {'enabled': bool, 'timeout': int})
multicast_set_igmp_snooping_parameters = TypedDict("multicast_set_igmp_snooping_parameters", {'snooping': bool})
dhcpclient_set_all_parameters = TypedDict("dhcpclient_set_all_parameters", {'id': int, 'operation': bool, 'provision': bool, 'filter': bool})
dhcp_set_relay_update_subnet_parameters = TypedDict("dhcp_set_relay_update_subnet_parameters", {'vid': int, 'servers': list, 'ports': list})
dhcp_set_server_id_override_parameters = TypedDict("dhcp_set_server_id_override_parameters", {'server_id_override': bool})
dhcp_set_remote_id_parameters = TypedDict("dhcp_set_remote_id_parameters", {'remote_type': int, 'remote_id': str})
dhcp_set_inserter_update_subnet_parameters = TypedDict("dhcp_set_inserter_update_subnet_parameters", {'vid': int, 'ports': list})
system_set_dnsclient_parameters = TypedDict("system_set_dnsclient_parameters", {'enabled': bool, 'server_primary': str, 'server_secondary': str, 'domain_name': str, 'dns_query_timeout': int, 'dns_query_retries': int, 'dns_over_tcp': bool})
dhcp_set_subnets_parameters = TypedDict("dhcp_set_subnets_parameters", {'add': list, 'upd': list, 'del': list})# SWITCH_DYNAMIC_TYPES_END

# SWITCH_DYNAMIC_FUNCTIONS_BEGIN

class PeridotJson:
    def __init__(self, url: str, session: Optional[requests.Session] = None):
        self._session = session if session is not None else requests.Session()
        self._url = url

    def get_session(self) -> requests.Session:
        return self._session

    def close_session(self) -> None:
        self._session.close()

    def set_session(self, session: requests.Session) -> None:
        self._session = session

    def __str__(self) -> str:
        return f"PeridotJson(url={self._url}, session={self._session})"

    def _send_json(self, name, data: dict, timeout_ms: int, throw: bool) -> requests.Response:
        if not self._url:
            raise RuntimeError(f"{self} url not set")
        logging.debug("%s sending request %s with data %s", self, name, data)
        res = self._session.post(self._url, json=data, timeout=timeout_ms / 1000)
        logging.debug("%s got %s", self, res.json())
        if res.status_code != 200 and throw:
            raise RuntimeError(
                f"HTTP request [{name}] with parameters {data} failed with exit code {res.status_code} and message {res.content.decode('utf-8')}")
        return res

    def user_login(self, parameters: user_login_parameters, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'user', 'command': 'login', 'access': 'get'}
        send_dict['parameters'] = parameters
        response = self._send_json('user_login', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def user_logout(self, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'user', 'command': 'logout', 'access': 'get'}
        response = self._send_json('user_logout', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def user_get_users(self, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'user', 'command': 'get users', 'access': 'get'}
        response = self._send_json('user_get_users', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def user_get_level(self, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'user', 'command': 'get level', 'access': 'get'}
        response = self._send_json('user_get_level', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def user_change_user_password(self, parameters: user_change_user_password_parameters, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'user', 'command': 'change user password', 'access': 'set'}
        send_dict['parameters'] = parameters
        response = self._send_json('user_change_user_password', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def user_add_user(self, parameters: user_add_user_parameters, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'user', 'command': 'add user', 'access': 'set'}
        send_dict['parameters'] = parameters
        response = self._send_json('user_add_user', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def user_factory_reset(self, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'user', 'command': 'factory reset', 'access': 'set'}
        response = self._send_json('user_factory_reset', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def user_remove_user(self, parameters: user_remove_user_parameters, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'user', 'command': 'remove user', 'access': 'set'}
        send_dict['parameters'] = parameters
        response = self._send_json('user_remove_user', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def system_boot_alternative_partition(self, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'system', 'command': 'boot alternative partition', 'access': 'set'}
        response = self._send_json('system_boot_alternative_partition', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def system_get_supply(self, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'system', 'command': 'get supply', 'access': 'get'}
        response = self._send_json('system_get_supply', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def system_get_id(self, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'system', 'command': 'get id', 'access': 'get'}
        response = self._send_json('system_get_id', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def system_get_id_open_api(self, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'system', 'command': 'get id open api', 'access': 'get'}
        response = self._send_json('system_get_id_open_api', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def system_get_info(self, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'system', 'command': 'get info', 'access': 'get'}
        response = self._send_json('system_get_info', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def system_has_unsaved_changes(self, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'system', 'command': 'has unsaved changes', 'access': 'get'}
        response = self._send_json('system_has_unsaved_changes', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def system_set_info(self, parameters: system_set_info_parameters, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'system', 'command': 'set info', 'access': 'set'}
        send_dict['parameters'] = parameters
        response = self._send_json('system_set_info', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def system_get_uptime(self, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'system', 'command': 'get uptime', 'access': 'get'}
        response = self._send_json('system_get_uptime', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def system_get_time(self, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'system', 'command': 'get time', 'access': 'get'}
        response = self._send_json('system_get_time', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def system_get_config_name(self, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'system', 'command': 'get config name', 'access': 'get'}
        response = self._send_json('system_get_config_name', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def system_factory_reset(self, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'system', 'command': 'factory reset', 'access': 'set'}
        response = self._send_json('system_factory_reset', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def system_factory_reset_and_save(self, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'system', 'command': 'factory reset and save', 'access': 'set'}
        response = self._send_json('system_factory_reset_and_save', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def system_create_config(self, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'system', 'command': 'create config', 'access': 'set'}
        response = self._send_json('system_create_config', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def system_create_config_base64(self, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'system', 'command': 'create config base64', 'access': 'set'}
        response = self._send_json('system_create_config_base64', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def system_apply_config(self, parameters: system_apply_config_parameters, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'system', 'command': 'apply config', 'access': 'set'}
        send_dict['parameters'] = parameters
        response = self._send_json('system_apply_config', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def system_validate_config_base64(self, parameters: system_validate_config_base64_parameters, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'system', 'command': 'validate config base64', 'access': 'set'}
        send_dict['parameters'] = parameters
        response = self._send_json('system_validate_config_base64', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def system_apply_config_base64(self, parameters: system_apply_config_base64_parameters, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'system', 'command': 'apply config base64', 'access': 'set'}
        send_dict['parameters'] = parameters
        response = self._send_json('system_apply_config_base64', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def system_apply_config_base64_and_save(self, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'system', 'command': 'apply config base64 and save', 'access': 'set'}
        response = self._send_json('system_apply_config_base64_and_save', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def system_apply_and_save_config(self, parameters: system_apply_and_save_config_parameters, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'system', 'command': 'apply and save config', 'access': 'set'}
        send_dict['parameters'] = parameters
        response = self._send_json('system_apply_and_save_config', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def system_save_config(self, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'system', 'command': 'save config', 'access': 'set'}
        response = self._send_json('system_save_config', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def system_save_config_with_name(self, parameters: system_save_config_with_name_parameters, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'system', 'command': 'save config with name', 'access': 'set'}
        send_dict['parameters'] = parameters
        response = self._send_json('system_save_config_with_name', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def system_install_update(self, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'system', 'command': 'install update', 'access': 'set'}
        response = self._send_json('system_install_update', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def system_reboot(self, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'system', 'command': 'reboot', 'access': 'set'}
        response = self._send_json('system_reboot', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def system_slots(self, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'system', 'command': 'slots', 'access': 'get'}
        response = self._send_json('system_slots', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def system_devicenumbers(self, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'system', 'command': 'devicenumbers', 'access': 'get'}
        response = self._send_json('system_devicenumbers', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def system_files(self, parameters: system_files_parameters, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'system', 'command': 'files', 'access': 'set'}
        send_dict['parameters'] = parameters
        response = self._send_json('system_files', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def snmp_get_config(self, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'snmp', 'command': 'get config', 'access': 'get'}
        response = self._send_json('snmp_get_config', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def snmp_get_user(self, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'snmp', 'command': 'get user', 'access': 'get'}
        response = self._send_json('snmp_get_user', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def snmp_set_config(self, parameters: snmp_set_config_parameters, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'snmp', 'command': 'set config', 'access': 'set'}
        send_dict['parameters'] = parameters
        response = self._send_json('snmp_set_config', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def snmp_add_user(self, parameters: list[snmp_add_user_parameters], timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'snmp', 'command': 'add user', 'access': 'set'}
        send_dict['parameters'] = parameters
        response = self._send_json('snmp_add_user', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def snmp_remove_user(self, parameters: list, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'snmp', 'command': 'remove user', 'access': 'set'}
        send_dict['parameters'] = parameters
        response = self._send_json('snmp_remove_user', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def interface_get_interfaces(self, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'interface', 'command': 'get interfaces', 'access': 'get'}
        response = self._send_json('interface_get_interfaces', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def interface_get_interfaces_state(self, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'interface', 'command': 'get interfaces state', 'access': 'get'}
        response = self._send_json('interface_get_interfaces_state', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def interface_set_interfaces(self, parameters: list[interface_set_interfaces_parameters], timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'interface', 'command': 'set interfaces', 'access': 'set'}
        send_dict['parameters'] = parameters
        response = self._send_json('interface_set_interfaces', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def interface_get_bsp_state(self, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'interface', 'command': 'get bsp state', 'access': 'get'}
        response = self._send_json('interface_get_bsp_state', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def interface_set_bsp_state(self, parameters: interface_set_bsp_state_parameters, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'interface', 'command': 'set bsp state', 'access': 'set'}
        send_dict['parameters'] = parameters
        response = self._send_json('interface_set_bsp_state', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def interface_get_counters(self, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'interface', 'command': 'get counters', 'access': 'get'}
        response = self._send_json('interface_get_counters', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def interface_get_load(self, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'interface', 'command': 'get load', 'access': 'get'}
        response = self._send_json('interface_get_load', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def vlan_get_vlan_interfaces(self, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'vlan', 'command': 'get vlan interfaces', 'access': 'get'}
        response = self._send_json('vlan_get_vlan_interfaces', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def vlan_set_vlan_interfaces(self, parameters: list[vlan_set_vlan_interfaces_parameters], timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'vlan', 'command': 'set vlan interfaces', 'access': 'set'}
        send_dict['parameters'] = parameters
        response = self._send_json('vlan_set_vlan_interfaces', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def vlan_get_vids(self, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'vlan', 'command': 'get vids', 'access': 'get'}
        response = self._send_json('vlan_get_vids', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def vlan_add_vids(self, parameters: list[vlan_add_vids_parameters], timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'vlan', 'command': 'add vids', 'access': 'set'}
        send_dict['parameters'] = parameters
        response = self._send_json('vlan_add_vids', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def vlan_remove_vids(self, parameters: list, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'vlan', 'command': 'remove vids', 'access': 'set'}
        send_dict['parameters'] = parameters
        response = self._send_json('vlan_remove_vids', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def vlan_get_vid_members(self, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'vlan', 'command': 'get vid members', 'access': 'get'}
        response = self._send_json('vlan_get_vid_members', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def vlan_set_vid_members(self, parameters: list[vlan_set_vid_members_parameters], timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'vlan', 'command': 'set vid members', 'access': 'set'}
        send_dict['parameters'] = parameters
        response = self._send_json('vlan_set_vid_members', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def vlan_get_bridges(self, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'vlan', 'command': 'get bridges', 'access': 'get'}
        response = self._send_json('vlan_get_bridges', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def vlan_set_bridges(self, parameters: list[vlan_set_bridges_parameters], timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'vlan', 'command': 'set bridges', 'access': 'set'}
        send_dict['parameters'] = parameters
        response = self._send_json('vlan_set_bridges', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def vlan_get_current_bridge_config(self, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'vlan', 'command': 'get current bridge config', 'access': 'get'}
        response = self._send_json('vlan_get_current_bridge_config', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def vlan_set_bridge_temporary(self, parameters: list[vlan_set_bridge_temporary_parameters], timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'vlan', 'command': 'set bridge temporary', 'access': 'set'}
        send_dict['parameters'] = parameters
        response = self._send_json('vlan_set_bridge_temporary', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def vlan_get_global_vlans(self, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'vlan', 'command': 'get global vlans', 'access': 'get'}
        response = self._send_json('vlan_get_global_vlans', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def vlan_set_global_vlans(self, parameters: vlan_set_global_vlans_parameters, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'vlan', 'command': 'set global vlans', 'access': 'set'}
        send_dict['parameters'] = parameters
        response = self._send_json('vlan_set_global_vlans', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def lldp_get_interfaces(self, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'lldp', 'command': 'get interfaces', 'access': 'get'}
        response = self._send_json('lldp_get_interfaces', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def lldp_set_interfaces(self, parameters: list[lldp_set_interfaces_parameters], timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'lldp', 'command': 'set interfaces', 'access': 'set'}
        send_dict['parameters'] = parameters
        response = self._send_json('lldp_set_interfaces', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def lldp_get_neighbors(self, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'lldp', 'command': 'get neighbors', 'access': 'get'}
        response = self._send_json('lldp_get_neighbors', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def dhcpv1_get_config(self, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'dhcpv1', 'command': 'get config', 'access': 'get'}
        response = self._send_json('dhcpv1_get_config', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def dhcpv1_set_config(self, parameters: dhcpv1_set_config_parameters, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'dhcpv1', 'command': 'set config', 'access': 'set'}
        send_dict['parameters'] = parameters
        response = self._send_json('dhcpv1_set_config', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def dhcpv1_get_static_leases(self, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'dhcpv1', 'command': 'get static leases', 'access': 'get'}
        response = self._send_json('dhcpv1_get_static_leases', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def dhcpv1_add_static_leases(self, parameters: list[dhcpv1_add_static_leases_parameters], timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'dhcpv1', 'command': 'add static leases', 'access': 'set'}
        send_dict['parameters'] = parameters
        response = self._send_json('dhcpv1_add_static_leases', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def dhcpv1_remove_static_leases(self, parameters: list[dhcpv1_remove_static_leases_parameters], timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'dhcpv1', 'command': 'remove static leases', 'access': 'set'}
        send_dict['parameters'] = parameters
        response = self._send_json('dhcpv1_remove_static_leases', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def dhcpv1_get_port_based(self, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'dhcpv1', 'command': 'get port based', 'access': 'get'}
        response = self._send_json('dhcpv1_get_port_based', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def dhcpv1_set_port_based(self, parameters: list[dhcpv1_set_port_based_parameters], timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'dhcpv1', 'command': 'set port based', 'access': 'set'}
        send_dict['parameters'] = parameters
        response = self._send_json('dhcpv1_set_port_based', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def dhcpv1_get_active_leases(self, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'dhcpv1', 'command': 'get active leases', 'access': 'get'}
        response = self._send_json('dhcpv1_get_active_leases', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def dhcpv1_get_port_ip(self, parameters: dhcpv1_get_port_ip_parameters, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'dhcpv1', 'command': 'get port ip', 'access': 'get'}
        send_dict['parameters'] = parameters
        response = self._send_json('dhcpv1_get_port_ip', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def dhcpv1_get_pool(self, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'dhcpv1', 'command': 'get pool', 'access': 'get'}
        response = self._send_json('dhcpv1_get_pool', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def dhcpv1_set_pool(self, parameters: dhcpv1_set_pool_parameters, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'dhcpv1', 'command': 'set pool', 'access': 'set'}
        send_dict['parameters'] = parameters
        response = self._send_json('dhcpv1_set_pool', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def mirroring_get_mirroring(self, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'mirroring', 'command': 'get mirroring', 'access': 'get'}
        response = self._send_json('mirroring_get_mirroring', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def mirroring_set_mirroring(self, parameters: mirroring_set_mirroring_parameters, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'mirroring', 'command': 'set mirroring', 'access': 'set'}
        send_dict['parameters'] = parameters
        response = self._send_json('mirroring_set_mirroring', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def qos_get_defaults(self, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'qos', 'command': 'get defaults', 'access': 'get'}
        response = self._send_json('qos_get_defaults', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def qos_set_defaults(self, parameters: list[qos_set_defaults_parameters], timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'qos', 'command': 'set defaults', 'access': 'set'}
        send_dict['parameters'] = parameters
        response = self._send_json('qos_set_defaults', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def qos_get_pcp_to_queue_mapping(self, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'qos', 'command': 'get pcp->queue mapping', 'access': 'get'}
        response = self._send_json('qos_get_pcp_to_queue_mapping', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def qos_set_pcp_to_queue_mapping(self, parameters: list, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'qos', 'command': 'set pcp->queue mapping', 'access': 'set'}
        send_dict['parameters'] = parameters
        response = self._send_json('qos_set_pcp_to_queue_mapping', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def qos_get_dscp_to_queue_mapping(self, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'qos', 'command': 'get dscp->queue mapping', 'access': 'get'}
        response = self._send_json('qos_get_dscp_to_queue_mapping', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def qos_set_dscp_to_queue_mapping(self, parameters: list, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'qos', 'command': 'set dscp->queue mapping', 'access': 'set'}
        send_dict['parameters'] = parameters
        response = self._send_json('qos_set_dscp_to_queue_mapping', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def qos_get_dscp_to_pcp_mapping(self, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'qos', 'command': 'get dscp->pcp mapping', 'access': 'get'}
        response = self._send_json('qos_get_dscp_to_pcp_mapping', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def qos_set_dscp_to_pcp_mapping(self, parameters: list, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'qos', 'command': 'set dscp->pcp mapping', 'access': 'set'}
        send_dict['parameters'] = parameters
        response = self._send_json('qos_set_dscp_to_pcp_mapping', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def igmp_set_bridge(self, parameters: igmp_set_bridge_parameters, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'igmp', 'command': 'set bridge', 'access': 'set'}
        send_dict['parameters'] = parameters
        response = self._send_json('igmp_set_bridge', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def igmp_get_all(self, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'igmp', 'command': 'get all', 'access': 'get'}
        response = self._send_json('igmp_get_all', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def igmp_get_router_ports(self, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'igmp', 'command': 'get router ports', 'access': 'get'}
        response = self._send_json('igmp_get_router_ports', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def igmp_set_router_ports(self, parameters: igmp_set_router_ports_parameters, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'igmp', 'command': 'set router ports', 'access': 'set'}
        send_dict['parameters'] = parameters
        response = self._send_json('igmp_set_router_ports', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def igmp_get_active(self, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'igmp', 'command': 'get active', 'access': 'get'}
        response = self._send_json('igmp_get_active', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def poe_get_port_cfg_state(self, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'poe', 'command': 'get port cfg state', 'access': 'get'}
        response = self._send_json('poe_get_port_cfg_state', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def poe_set_port_cfg_state(self, parameters: list[poe_set_port_cfg_state_parameters], timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'poe', 'command': 'set port cfg state', 'access': 'set'}
        send_dict['parameters'] = parameters
        response = self._send_json('poe_set_port_cfg_state', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def poe_get_global_state(self, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'poe', 'command': 'get global state', 'access': 'get'}
        response = self._send_json('poe_get_global_state', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def poe_get_poe_state(self, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'poe', 'command': 'get poe state', 'access': 'get'}
        response = self._send_json('poe_get_poe_state', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def production_upload_configuration(self, parameters: production_upload_configuration_parameters, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'production', 'command': 'upload configuration', 'access': 'set'}
        send_dict['parameters'] = parameters
        response = self._send_json('production_upload_configuration', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def production_download_configuration(self, parameters: production_download_configuration_parameters, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'production', 'command': 'download configuration', 'access': 'get'}
        send_dict['parameters'] = parameters
        response = self._send_json('production_download_configuration', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def production_apply_configuration(self, parameters: production_apply_configuration_parameters, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'production', 'command': 'apply configuration', 'access': 'set'}
        send_dict['parameters'] = parameters
        response = self._send_json('production_apply_configuration', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def dhcpclient_all(self, parameters: list[dhcpclient_all_parameters], timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'dhcpclient', 'command': 'all', 'access': 'rw'}
        send_dict['parameters'] = parameters
        response = self._send_json('dhcpclient_all', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def stp_get_stp_version(self, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'stp', 'command': 'get stp version', 'access': 'get'}
        response = self._send_json('stp_get_stp_version', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def stp_set_stp_version(self, parameters: stp_set_stp_version_parameters, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'stp', 'command': 'set stp version', 'access': 'set'}
        send_dict['parameters'] = parameters
        response = self._send_json('stp_set_stp_version', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def stp_port_state(self, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'stp', 'command': 'port state', 'access': 'get'}
        response = self._send_json('stp_port_state', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def stp_rootbridge(self, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'stp', 'command': 'rootbridge', 'access': 'get'}
        response = self._send_json('stp_rootbridge', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def ntp_get_config(self, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'ntp', 'command': 'get config', 'access': 'get'}
        response = self._send_json('ntp_get_config', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def ntp_set_config(self, parameters: ntp_set_config_parameters, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'ntp', 'command': 'set config', 'access': 'set'}
        send_dict['parameters'] = parameters
        response = self._send_json('ntp_set_config', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def trap_get_trap(self, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'trap', 'command': 'get trap', 'access': 'get'}
        response = self._send_json('trap_get_trap', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def trap_set_trap(self, parameters: trap_set_trap_parameters, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'trap', 'command': 'set trap', 'access': 'set'}
        send_dict['parameters'] = parameters
        response = self._send_json('trap_set_trap', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def log_get_remote(self, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'log', 'command': 'get remote', 'access': 'get'}
        response = self._send_json('log_get_remote', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def log_set_remote(self, parameters: log_set_remote_parameters, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'log', 'command': 'set remote', 'access': 'set'}
        send_dict['parameters'] = parameters
        response = self._send_json('log_set_remote', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def log_get_log(self, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'log', 'command': 'get log', 'access': 'get'}
        response = self._send_json('log_get_log', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def log_remove_log(self, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'log', 'command': 'remove log', 'access': 'set'}
        response = self._send_json('log_remove_log', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def mqtt_get_mqtt(self, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'mqtt', 'command': 'get mqtt', 'access': 'get'}
        response = self._send_json('mqtt_get_mqtt', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def mqtt_set_mqtt(self, parameters: mqtt_set_mqtt_parameters, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'mqtt', 'command': 'set mqtt', 'access': 'set'}
        send_dict['parameters'] = parameters
        response = self._send_json('mqtt_set_mqtt', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def staticmc_add_entry(self, parameters: staticmc_add_entry_parameters, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'staticmc', 'command': 'add entry', 'access': 'set'}
        send_dict['parameters'] = parameters
        response = self._send_json('staticmc_add_entry', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def staticmc_remove_entry(self, parameters: staticmc_remove_entry_parameters, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'staticmc', 'command': 'remove entry', 'access': 'set'}
        send_dict['parameters'] = parameters
        response = self._send_json('staticmc_remove_entry', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def staticmc_get_entries(self, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'staticmc', 'command': 'get entries', 'access': 'get'}
        response = self._send_json('staticmc_get_entries', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def dhcp_get_vids(self, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'dhcp', 'command': 'get vids', 'access': 'get'}
        response = self._send_json('dhcp_get_vids', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def dhcp_set_vids(self, parameters: list[dhcp_set_vids_parameters], timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'dhcp', 'command': 'set vids', 'access': 'set'}
        send_dict['parameters'] = parameters
        response = self._send_json('dhcp_set_vids', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def dhcp_get_active_leases(self, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'dhcp', 'command': 'get active leases', 'access': 'get'}
        response = self._send_json('dhcp_get_active_leases', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def dhcp_get_cfg_leases(self, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'dhcp', 'command': 'get cfg leases', 'access': 'get'}
        response = self._send_json('dhcp_get_cfg_leases', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def dhcp_remove_cfg_leases(self, parameters: dhcp_remove_cfg_leases_parameters, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'dhcp', 'command': 'remove cfg leases', 'access': 'set'}
        send_dict['parameters'] = parameters
        response = self._send_json('dhcp_remove_cfg_leases', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def dhcp_add_cfg_leases(self, parameters: dhcp_add_cfg_leases_parameters, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'dhcp', 'command': 'add cfg leases', 'access': 'set'}
        send_dict['parameters'] = parameters
        response = self._send_json('dhcp_add_cfg_leases', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def dhcp_get_subnet(self, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'dhcp', 'command': 'get subnet', 'access': 'get'}
        response = self._send_json('dhcp_get_subnet', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def dhcp_set_subnet(self, parameters: dhcp_set_subnet_parameters, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'dhcp', 'command': 'set subnet', 'access': 'set'}
        send_dict['parameters'] = parameters
        response = self._send_json('dhcp_set_subnet', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def dhcp_remove_subnet(self, parameters: dhcp_remove_subnet_parameters, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'dhcp', 'command': 'remove subnet', 'access': 'set'}
        send_dict['parameters'] = parameters
        response = self._send_json('dhcp_remove_subnet', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def dhcp_edit_subnet(self, parameters: dhcp_edit_subnet_parameters, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'dhcp', 'command': 'edit subnet', 'access': 'set'}
        send_dict['parameters'] = parameters
        response = self._send_json('dhcp_edit_subnet', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def dhcpv2_subnets(self, parameters: dhcpv2_subnets_parameters, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'dhcpv2', 'command': 'subnets', 'access': 'rw'}
        send_dict['parameters'] = parameters
        response = self._send_json('dhcpv2_subnets', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def vlan_get_vlan_port_settings(self, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'vlan', 'access': 'get', 'command': 'vlan port settings'}
        response = self._send_json('vlan_get_vlan_port_settings', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def vlan_set_update_vlan_port_settings(self, parameters: dict, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'vlan', 'access': 'set', 'command': 'update vlan port settings'}
        send_dict['parameters'] = parameters
        response = self._send_json('vlan_set_update_vlan_port_settings', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def vlan_get_get_bridges(self, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'vlan', 'access': 'get', 'command': 'get bridges'}
        response = self._send_json('vlan_get_get_bridges', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def vlan_set_set_bridges(self, parameters: list[vlan_set_set_bridges_parameters], timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'vlan', 'access': 'set', 'command': 'set bridges'}
        send_dict['parameters'] = parameters
        response = self._send_json('vlan_set_set_bridges', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def vlan_get_get_vid(self, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'vlan', 'access': 'get', 'command': 'get vid'}
        response = self._send_json('vlan_get_get_vid', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def vlan_set_add_vlan_id(self, parameters: vlan_set_add_vlan_id_parameters, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'vlan', 'access': 'set', 'command': 'add vlan id'}
        send_dict['parameters'] = parameters
        response = self._send_json('vlan_set_add_vlan_id', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def vlan_set_remove_vlan_id(self, parameters: vlan_set_remove_vlan_id_parameters, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'vlan', 'access': 'set', 'command': 'remove vlan id'}
        send_dict['parameters'] = parameters
        response = self._send_json('vlan_set_remove_vlan_id', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def vlan_set_set_bonds(self, parameters: dict, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'vlan', 'access': 'set', 'command': 'set bonds'}
        send_dict['parameters'] = parameters
        response = self._send_json('vlan_set_set_bonds', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def vlan_get_get_bonds(self, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'vlan', 'access': 'get', 'command': 'get bonds'}
        response = self._send_json('vlan_get_get_bonds', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def nat_get_state(self, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'nat', 'access': 'get', 'command': 'state'}
        response = self._send_json('nat_get_state', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def nat_set_state(self, parameters: nat_set_state_parameters, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'nat', 'access': 'set', 'command': 'state'}
        send_dict['parameters'] = parameters
        response = self._send_json('nat_set_state', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def nat_get_rule(self, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'nat', 'access': 'get', 'command': 'rule'}
        response = self._send_json('nat_get_rule', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def nat_add_rule(self, parameters: nat_add_rule_parameters, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'nat', 'access': 'add', 'command': 'rule'}
        send_dict['parameters'] = parameters
        response = self._send_json('nat_add_rule', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def nat_remove_rule(self, parameters: nat_remove_rule_parameters, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'nat', 'access': 'remove', 'command': 'rule'}
        send_dict['parameters'] = parameters
        response = self._send_json('nat_remove_rule', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def ignition_set_settings(self, parameters: ignition_set_settings_parameters, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'ignition', 'access': 'set', 'command': 'settings'}
        send_dict['parameters'] = parameters
        response = self._send_json('ignition_set_settings', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def ignition_get_settings(self, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'ignition', 'access': 'get', 'command': 'settings'}
        response = self._send_json('ignition_get_settings', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def ignition_get_status(self, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'ignition', 'access': 'get', 'command': 'status'}
        response = self._send_json('ignition_get_status', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def multicast_get_igmp_snooping(self, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'multicast', 'access': 'get', 'command': 'igmp snooping'}
        response = self._send_json('multicast_get_igmp_snooping', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def multicast_set_igmp_snooping(self, parameters: multicast_set_igmp_snooping_parameters, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'multicast', 'access': 'set', 'command': 'igmp snooping'}
        send_dict['parameters'] = parameters
        response = self._send_json('multicast_set_igmp_snooping', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def dhcpclient_set_all(self, parameters: list[dhcpclient_set_all_parameters], timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'dhcpclient', 'access': 'set', 'command': 'all'}
        send_dict['parameters'] = parameters
        response = self._send_json('dhcpclient_set_all', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def dhcpclient_get_all(self, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'dhcpclient', 'access': 'get', 'command': 'all'}
        response = self._send_json('dhcpclient_get_all', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def dhcp_get_relay_settings(self, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'dhcp', 'access': 'get', 'command': 'relay settings'}
        response = self._send_json('dhcp_get_relay_settings', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def dhcp_set_relay_update_subnet(self, parameters: dhcp_set_relay_update_subnet_parameters, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'dhcp', 'access': 'set', 'command': 'relay update subnet'}
        send_dict['parameters'] = parameters
        response = self._send_json('dhcp_set_relay_update_subnet', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def dhcp_set_server_id_override(self, parameters: dhcp_set_server_id_override_parameters, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'dhcp', 'access': 'set', 'command': 'server id override'}
        send_dict['parameters'] = parameters
        response = self._send_json('dhcp_set_server_id_override', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def dhcp_set_remote_id(self, parameters: dhcp_set_remote_id_parameters, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'dhcp', 'access': 'set', 'command': 'remote id'}
        send_dict['parameters'] = parameters
        response = self._send_json('dhcp_set_remote_id', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def dhcp_get_remote_id(self, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'dhcp', 'access': 'get', 'command': 'remote id'}
        response = self._send_json('dhcp_get_remote_id', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def dhcp_get_server_id_override(self, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'dhcp', 'access': 'get', 'command': 'server id override'}
        response = self._send_json('dhcp_get_server_id_override', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def dhcp_get_inserter_settings(self, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'dhcp', 'access': 'get', 'command': 'inserter settings'}
        response = self._send_json('dhcp_get_inserter_settings', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def dhcp_set_inserter_update_subnet(self, parameters: dhcp_set_inserter_update_subnet_parameters, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'dhcp', 'access': 'set', 'command': 'inserter update subnet'}
        send_dict['parameters'] = parameters
        response = self._send_json('dhcp_set_inserter_update_subnet', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def system_set_dnsclient(self, parameters: system_set_dnsclient_parameters, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'system', 'command': 'dnsclient', 'access': 'set'}
        send_dict['parameters'] = parameters
        response = self._send_json('system_set_dnsclient', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def system_get_dnsclient(self, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'system', 'command': 'dnsclient', 'access': 'get'}
        response = self._send_json('system_get_dnsclient', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def dhcp_set_subnets(self, parameters: dhcp_set_subnets_parameters, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'dhcp', 'command': 'subnets', 'access': 'set'}
        send_dict['parameters'] = parameters
        response = self._send_json('dhcp_set_subnets', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)

    def dhcp_get_subnets(self, timeout_ms: int = 34000, throw: bool = True) -> tuple[Any, requests.models.Response]:
        send_dict: dict[str, Any] = {'service': 'dhcp', 'command': 'subnets', 'access': 'get'}
        response = self._send_json('dhcp_get_subnets', send_dict, timeout_ms=timeout_ms, throw=throw)
        return (response.json(), response)# SWITCH_DYNAMIC_FUNCTIONS_END
