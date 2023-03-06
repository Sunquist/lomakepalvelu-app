import { Accordion, Group, Paper, Select, Space, Switch, Text, TextInput } from "@mantine/core";

import {
    IconFileDescription,
    IconCloudLock,
    IconLayoutList,
} from '@tabler/icons';
import { TemplateType } from "../../../models/template";
import useTranslation from "next-translate/useTranslation";

type EditorSettingsProps = {
    onChange(key: string, value: any): void,
    data: TemplateType
}

export default function EditorSettings ({ onChange, data } : EditorSettingsProps) {
    const { t, lang } = useTranslation("common");
    return (
        <Paper sx={{borderRadius: "0px 0px 4px 4px !important"}}>
            <Accordion variant="contained" defaultValue={"basicinfo"} sx={{borderRadius: "0px 0px 4px 4px !important"}}>
                <Accordion.Item value="basicinfo" sx={{borderRadius: "0px !important"}}>
                    <Paper sx={{borderRadius: "0px 0px 4px 4px !important"}}>
                        <Accordion.Control p="xs">
                            <Group noWrap>
                                <IconFileDescription size={24} />
                                <div>
                                    <Text>{t("TEMPLATE_EDITOR_FORMINFO_BASIC")}</Text>
                                    <Text size="sm" color="dimmed" weight={400}>
                                    {t("TEMPLATE_EDITOR_FORMINFO_BASIC_DESCRIPTION")}
                                    </Text>
                                </div>
                            </Group>
                        </Accordion.Control>
                        <Accordion.Panel>
                            <TextInput 
                                label={t("TEMPLATE_EDITOR_FORMINFO_FIELD_NAME_LABEL")}
                                placeholder={t("TEMPLATE_EDITOR_FORMINFO_FIELD_NAME_DESCRIPTION")}
                                onChange={(evnt) => {
                                    onChange('Name', evnt.target.value);
                                }}
                            />
                        </Accordion.Panel>
                    </Paper>
                </Accordion.Item>

                <Accordion.Item value="layout">
                    <Paper>
                        <Accordion.Control p="xs">
                            <Group noWrap>
                                <IconLayoutList size={24} />
                                <div>
                                    <Text>{t("TEMPLATE_EDITOR_FORMINFO_STYLE")}</Text>
                                    <Text size="sm" color="dimmed" weight={400}>
                                    {t("TEMPLATE_EDITOR_FORMINFO_BASIC_STYLE")}
                                    </Text>
                                </div>
                            </Group>
                        </Accordion.Control>
                        <Accordion.Panel>
                            <Select
                                label={t("TEMPLATE_EDITOR_FORMINFO_FIELD_THEME_LABEL")}
                                placeholder="Valitse..."
                                defaultValue={(data && data.Theme)? data.Theme : 'default'}
                                data={[
                                    { value: 'default', label: t("TEMPLATE_EDITOR_FORMINFO_FIELD_THEME_DEFAULT") },
                                ]}
                            />
                            <Select
                                label={t("TEMPLATE_EDITOR_FORMINFO_FIELD_LAYOUT_LABEL")}
                                placeholder="Valitse..."
                                defaultValue={(data && data.Layout)? data.Layout : 'contained'}
                                data={[
                                    { value: 'contained', label: t("TEMPLATE_EDITOR_FORMINFO_FIELD_LAYOUT_CONTAINED") },
                                    { value: 'filled', label: t("TEMPLATE_EDITOR_FORMINFO_FIELD_LAYOUT_FILL") },
                                ]}
                                onChange={(value) => {
                                    onChange('Layout', value || "contained");
                                }}
                            />
                        </Accordion.Panel>
                    </Paper>
                </Accordion.Item>
                
                <Accordion.Item value="securityinfo">
                    <Paper>
                        <Accordion.Control p="xs"> 
                            <Group noWrap>
                                <IconCloudLock size={24} />
                                <div>
                                    <Text>{t("TEMPLATE_EDITOR_FORMINFO_SECURITY")}</Text>
                                    <Text size="sm" color="dimmed" weight={400}>
                                    {t("TEMPLATE_EDITOR_FORMINFO_SECURITY_DESCRIPTION")}
                                    </Text>
                                </div>
                            </Group>
                        </Accordion.Control>
                        <Accordion.Panel>
                            <TextInput 
                                label={t("TEMPLATE_EDITOR_FORMINFO_DESTROYTIME_LABEL")}
                                placeholder={t("TEMPLATE_EDITOR_FORMINFO_DESTROYTIME_PLACEHOLDER")}
                                onChange={(evnt) => {
                                    onChange('Security', { ...data.Security, TTL: evnt.target.value});
                                }}
                            />
                            <TextInput 
                                label={t("TEMPLATE_EDITOR_FORMINFO_EXPIRETIME_LABEL")}
                                placeholder={t("TEMPLATE_EDITOR_FORMINFO_EXPIRETIME_PLACEHOLDER")}
                                onChange={(evnt) => {
                                    onChange('Security', { ...data.Security, TTE: evnt.target.value});
                                }}
                            />
                            <Space h="xs" />
                            <Switch
                                label={t("TEMPLATE_EDITOR_FORMINFO_PUBLICLINK_LABEL")}
                                onChange={(evnt) => {
                                    onChange('Security', { ...data.Security, PublicEnabled: evnt.target.checked});
                                }}
                            />
                        </Accordion.Panel>
                    </Paper>
                </Accordion.Item>
            </Accordion>
        </Paper>
    )
}