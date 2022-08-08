import { useMantineColorScheme, Paper, Grid, Space, Title, Text, Card, Group, Switch, Badge, createStyles, Select, Accordion, Timeline, Avatar, Divider, TextInput, Chip, JsonInput, ScrollArea, Center, SegmentedControl, Box  } from '@mantine/core';
import { openConfirmModal } from '@mantine/modals';
import { useEffect, useState } from 'react';
import { translate } from '../../../utils/translate';
import { DragDropContext, Droppable, resetServerContext } from 'react-beautiful-dnd';
import { showNotification } from '@mantine/notifications';
import { Prism } from '@mantine/prism';
import dynamic from 'next/dynamic'

import {
    IconFileDescription,
    IconShieldLock,
    IconLock,
    IconCode,
    IconForms,
    IconLayout,
    IconCloudLock,
    IconGitBranch, 
    IconGitPullRequest, 
    IconGitCommit, 
    IconMessageDots,
    IconDeviceFloppy,
    IconX,
    IconLayoutList,
    IconEye,
    IconExternalLink,
    IconDeviceDesktop,
    IconDeviceTablet,
} from '@tabler/icons';

import DraggableNewField from './draggableNewField';
import { FIELDS, FieldTypeListItem, FieldTypes } from '../../field';

import Style from './editor.module.css';
import FormStyle from '../../../styles/FormStyles.module.css';
import TemplateModel, { getDefaultTemplate, TemplateType } from '../../../models/template';
import VerifyModel from '../../../utils/VerifyModel';

function FormEditor(props: any) {
  const [hoverArea, setHoverArea] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [stage, setStage] = useState(0);
  const [data, setData] = useState<TemplateType>(getDefaultTemplate());
  const [viewMode, setViewMode] = useState('code');
  const { colorScheme } = useMantineColorScheme();

  const onDragEnd = (context: any) => {
    const { destination, source } = context;
    const { droppableId, index } = source;
    setIsDragging(false)

    if((!droppableId || !droppableId.startsWith('stage')) && (!destination))
        return;

    const [stageInfo, stageIndex, sectionInfo, sectionIndex] = droppableId.startsWith('stage')? droppableId.split("_") : destination.droppableId.split("_");
    const stage = data.Stages[parseInt(stageIndex)];
    const section = stage.Sections[parseInt(sectionIndex)];

    if(droppableId.startsWith('stage')){
        const field = section.Fields[index]
        if(!destination)
            return openConfirmModal({
                title: translate("MODAL_CONFIRM_DELETION"),
                centered: true,
                children: (
                  <Text size="sm">
                    {translate("MODAL_CONFIRM_DELETION_DESCRIPTION")}
                  </Text>
                ),
                labels: { confirm: translate("MODAL_CONFIRM_DELETION_BUTTON_CONFIRM"), cancel: translate("MODAL_CONFIRM_DELETION_BUTTON_CANCEL") },
                confirmProps: { color: 'red' },
                onCancel: () => console.log('Cancelled action'),
                onConfirm: () => {
                    section.Fields.splice(index, 1);
                    onChange('Stages', [
                        ...(data.Stages || []).filter((row, index) => index !== parseInt(stageIndex)),
                        {
                            ...stage,
                            Sections: [
                                ...(stage.Sections || []).filter((row, index) => index !== parseInt(sectionIndex)),
                                {
                                    ...section,
                                    Fields: section.Fields
                                }
                            ]
                        }
                    ])
                },
            });

        section.Fields.splice(index, 1)
        section.Fields.splice(destination.index, 0, field)
    }else{
        const Field = FieldTypes[droppableId][parseInt(index)];
        const newField = Field.getDefault((section.Fields)? section.Fields.length + 1 : 1);
        section.Fields.splice(destination.index, 0, newField)
    }

    onChange('Stages', [
        ...(data.Stages || []).filter((row, index) => index !== parseInt(stageIndex)),
        {
            ...stage,
            Sections: [
                ...(stage.Sections || []).filter((row, index) => index !== parseInt(sectionIndex)),
                {
                    ...section,
                    Fields: section.Fields
                }
            ]
        }
    ])
  };

  useEffect(() => {
    
  }, []);

  const onChange = (key: string, value: any) => {
    try{
        setData(VerifyModel({
            ...data,
            [key]: value
        }, TemplateModel))
    }catch(ex: any){
        console.log({ex})
        showNotification({
            title: 'Error',
            message: ex.message,
            color: 'red',
            icon: <IconX />,
        })
    }
  } 

  return (
    <div className={Style.FormEditorContainer}>
        <Grid columns={30}>
            <DragDropContext
                onDragEnd={(context: any) => onDragEnd(context)}
                onDragStart={(context: any) => setIsDragging(true)}
                onDragUpdate={(context: any) => {
                    setHoverArea((context && context.destination && context.destination.droppableId)? context.destination.droppableId : null)
                }}
            >  
                <Grid.Col span={7}>
                    <Paper>
                        <Accordion variant="contained" radius="sm">
                            <Accordion.Item value="basicinfo">
                                <Paper>
                                    <Accordion.Control p="xs">
                                        <Group noWrap>
                                            <IconFileDescription size={24} />
                                            <div>
                                                <Text>{translate("TEMPLATE_EDITOR_FORMINFO_BASIC")}</Text>
                                                <Text size="sm" color="dimmed" weight={400}>
                                                {translate("TEMPLATE_EDITOR_FORMINFO_BASIC_DESCRIPTION")}
                                                </Text>
                                            </div>
                                        </Group>
                                    </Accordion.Control>
                                    <Accordion.Panel>
                                        <TextInput 
                                            label={translate("TEMPLATE_EDITOR_FORMINFO_FIELD_NAME_LABEL")}
                                            placeholder={translate("TEMPLATE_EDITOR_FORMINFO_FIELD_NAME_DESCRIPTION")}
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
                                                <Text>{translate("TEMPLATE_EDITOR_FORMINFO_STYLE")}</Text>
                                                <Text size="sm" color="dimmed" weight={400}>
                                                {translate("TEMPLATE_EDITOR_FORMINFO_BASIC_STYLE")}
                                                </Text>
                                            </div>
                                        </Group>
                                    </Accordion.Control>
                                    <Accordion.Panel>
                                        <Select
                                            label={translate("TEMPLATE_EDITOR_FORMINFO_FIELD_THEME_LABEL")}
                                            placeholder="Valitse..."
                                            defaultValue={(data && data.Theme)? data.Theme : 'default'}
                                            data={[
                                                { value: 'default', label: translate("TEMPLATE_EDITOR_FORMINFO_FIELD_THEME_DEFAULT") },
                                            ]}
                                        />
                                        <Select
                                            label={translate("TEMPLATE_EDITOR_FORMINFO_FIELD_LAYOUT_LABEL")}
                                            placeholder="Valitse..."
                                            defaultValue={(data && data.Layout)? data.Layout : 'contained'}
                                            data={[
                                                { value: 'contained', label: translate("TEMPLATE_EDITOR_FORMINFO_FIELD_LAYOUT_CONTAINED") },
                                                { value: 'filled', label: translate("TEMPLATE_EDITOR_FORMINFO_FIELD_LAYOUT_FILL") },
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
                                                <Text>{translate("TEMPLATE_EDITOR_FORMINFO_SECURITY")}</Text>
                                                <Text size="sm" color="dimmed" weight={400}>
                                                {translate("TEMPLATE_EDITOR_FORMINFO_SECURITY_DESCRIPTION")}
                                                </Text>
                                            </div>
                                        </Group>
                                    </Accordion.Control>
                                    <Accordion.Panel>
                                        <TextInput 
                                            label={translate("TEMPLATE_EDITOR_FORMINFO_DESTROYTIME_LABEL")}
                                            placeholder={translate("TEMPLATE_EDITOR_FORMINFO_DESTROYTIME_PLACEHOLDER")}
                                            onChange={(evnt) => {
                                                onChange('Security', { ...data.Security, TTL: evnt.target.value});
                                            }}
                                        />
                                        <TextInput 
                                            label={translate("TEMPLATE_EDITOR_FORMINFO_EXPIRETIME_LABEL")}
                                            placeholder={translate("TEMPLATE_EDITOR_FORMINFO_EXPIRETIME_PLACEHOLDER")}
                                            onChange={(evnt) => {
                                                onChange('Security', { ...data.Security, TTE: evnt.target.value});
                                            }}
                                        />
                                        <Space h="xs" />
                                        <Switch
                                            label={translate("TEMPLATE_EDITOR_FORMINFO_PUBLICLINK_LABEL")}
                                            onChange={(evnt) => {
                                                onChange('Security', { ...data.Security, PublicEnabled: evnt.target.checked});
                                            }}
                                        />
                                    </Accordion.Panel>
                                </Paper>
                            </Accordion.Item>
                        </Accordion>
                    </Paper>
                    <Paper>
                        <Droppable droppableId="BasicTypes" direction="vertical" createClone={true} isDropDisabled={true}>
                            {(provided: any, snapshot: any) => (
                                <div {...provided.droppableProps} style={{marginTop: 10}} ref={provided.innerRef}>
                                    <Accordion defaultValue={"basic"} variant="contained" radius="sm" >
                                        <Accordion.Item value="basic">
                                            <Paper>
                                                <Accordion.Control p="xs">
                                                    <Group noWrap>
                                                        <IconForms size={24} />
                                                        <div>
                                                            <Text>{translate("TEMPLATE_EDITOR_FIELDS_BASIC")}</Text>
                                                            <Text size="sm" color="dimmed" weight={400}>
                                                                {translate("TEMPLATE_EDITOR_FIELDS_BASIC_DESCRIPTION")}
                                                            </Text>
                                                        </div>
                                                    </Group>
                                                </Accordion.Control>
                                                <Accordion.Panel>
                                                    {FieldTypes.BasicTypes.map((field, index) => {
                                                        return (<DraggableNewField key={`${field.type}_${index}_key`} id={`field_${field.type}_${index}`} field={field} index={index} />)
                                                    })}
                                                </Accordion.Panel>
                                            </Paper>
                                        </Accordion.Item>
                                        <Accordion.Item value="advanced">
                                        <Paper>
                                                <Accordion.Control p="xs">
                                                    <Group noWrap>
                                                        <IconCode size={24} />
                                                        <div>
                                                            <Text>{translate("TEMPLATE_EDITOR_FIELDS_ADVANCED")}</Text>
                                                            <Text size="sm" color="dimmed" weight={400}>
                                                            {translate("TEMPLATE_EDITOR_FIELDS_ADVANCED_DESCRIPTION")}
                                                            </Text>
                                                        </div>
                                                    </Group>
                                                </Accordion.Control>
                                                <Accordion.Panel>
                                                    {FieldTypes.BasicTypes.map((field, index) => {
                                                        return (<DraggableNewField key={`${field.type}_${index}_key_2`} id={`field_${field.type}_${index}_2`} field={field} index={index} />)
                                                    })}
                                                </Accordion.Panel>
                                            </Paper>
                                        </Accordion.Item>
                                        <Accordion.Item value="Layout">
                                            <Paper>
                                                <Accordion.Control p="xs">
                                                    <Group noWrap>
                                                        <IconLayout size={24} />
                                                        <div>
                                                            <Text>{translate("TEMPLATE_EDITOR_FIELDS_LAYOUT")}</Text>
                                                            <Text size="sm" color="dimmed" weight={400}>
                                                            {translate("TEMPLATE_EDITOR_FIELDS_LAYOUT_DESCRIPTION")}
                                                            </Text>
                                                        </div>
                                                    </Group>
                                                </Accordion.Control>
                                                <Accordion.Panel>
                                                    {FieldTypes.BasicTypes.map((field, index) => {
                                                        return (<DraggableNewField key={`${field.type}_${index}_key_3`} id={`field_${field.type}_${index}_3`} field={field} index={index} />)
                                                    })}
                                                </Accordion.Panel>
                                            </Paper>
                                        </Accordion.Item>
                                    </Accordion>  
                                </div>    
                                )}       
                        </Droppable>
                    </Paper>
                </Grid.Col>
                <Grid.Col span={16}>
                    <Center>
                        <SegmentedControl
                            onChange={(value) => {
                                if(value !== "preview")
                                    return setViewMode(value)
                                //Open preview
                                window.open('/','_blank');
                            }}
                            value={viewMode}
                            data={[
                                {
                                    value: 'code',
                                    label: (
                                        <Center>
                                            <IconCode size={16} />
                                            <Box ml={10}>{translate("TEMPLATE_EDITOR_SEGMENT_CODE")}</Box>
                                        </Center>
                                    ),
                                },
                                {
                                    value: 'desktop',
                                    label: (
                                        <Center>
                                        <IconDeviceDesktop size={16} />
                                        <Box ml={10}>{translate("TEMPLATE_EDITOR_SEGMENT_DESKTOP")}</Box>
                                        </Center>
                                    ),
                                },
                                {
                                    value: 'mobile',
                                    label: (
                                        <Center>
                                        <IconDeviceTablet size={16} />
                                        <Box ml={10}>{translate("TEMPLATE_EDITOR_SEGMENT_MOBILE")}</Box>
                                        </Center>
                                    ),
                                },
                                {
                                    value: 'preview',
                                    disabled: true,
                                    label: (
                                        <Center title={translate("FEATURE_COMING_SOON")}>
                                            <IconExternalLink size={16} />
                                            <Box ml={10}>{translate("TEMPLATE_EDITOR_SEGMENT_PREVIEW")}</Box>
                                        </Center>
                                    ),
                                },
                            ]}
                        />
                    </Center>
                    <Space h="xs" />
                    {
                        (viewMode === "mobile") &&
                        <Center>
                            <div className={(colorScheme === "dark")? Style.smartphoneDark : Style.smartphone}>
                                <div className={Style.smartphoneContent}>
                                    
                                </div>
                            </div>
                        </Center>
                    }
                    {
                        (viewMode === "code" && data && data.Stages && data.Stages.length > 0 && data.Stages[stage].Sections && data.Stages[stage].Sections && data.Stages[stage].Sections.length > 0) &&
                        data.Stages[stage].Sections.map((section, index) => {
                            return (
                                <Center key={`droppable_section_${section.id}`}>
                                    <div className={(data && data.Layout == "contained")? FormStyle.Contained : FormStyle.Filled}>
                                        <Paper radius="sm" p="md" withBorder>
                                            <Droppable droppableId={`stage_${stage}_section_${index}`} direction="vertical">
                                                {(provided: any, snapshot: any) => (
                                                    <div {...provided.droppableProps} style={{ minHeight: 100, padding: 5, paddingBottom: 20, borderRadius: 5, border: snapshot.isDraggingOver ? '1px solid lightblue' : (isDragging)? '1px dashed grey' : '1px solid rgba(0,0,0,0)' }} ref={provided.innerRef}>
                                                        {(!section.Fields || section.Fields.length < 1) &&
                                                            <div>
                                                                <Center>
                                                                    <Title>{translate(`TEMPLATE_EDITOR_EMPTY_SECTION_TITLE`)}</Title>
                                                                </Center>
                                                                <Center>
                                                                    <Text color="dimmed" size="sm">
                                                                        {translate(`TEMPLATE_EDITOR_EMPTY_SECTION_DESCRIPTION`)}
                                                                    </Text>
                                                                </Center>
                                                            </div>
                                                        }
                                                        {section.Fields?.map((field, i) => {
                                                            try {
                                                                const FieldItem = FIELDS[field.type];
                                                                if(!FieldItem)
                                                                    throw(new Error(`Trying to render field with invalid type ${field.type}`))

                                                                return <FieldItem.renderAdmin field={field} index={i} />
                                                            }catch(ex: any){
                                                                console.log({ex})
                                                                showNotification({
                                                                    title: 'Error',
                                                                    message: ex.message,
                                                                    color: 'red',
                                                                    icon: <IconX />,
                                                                })
                                                            }
                                                            
                                                        })}
                                                        {provided.placeholder}
                                                    </div>
                                                )}
                                            </Droppable>
                                        </Paper>
                                    </div>
                                </Center>
                            )
                        })
                    }
                </Grid.Col>
                
                <Grid.Col span={7}>
                    <Accordion variant="contained" radius="sm" defaultValue="json">
                        <Accordion.Item value="save">
                            <Paper>
                                <Accordion.Control p="xs">
                                    <Group noWrap>
                                        <IconDeviceFloppy size={24} />
                                        <div>
                                            <Text>{translate("TEMPLATE_EDITOR_SAVEOPTIONS_TITLE")}</Text>
                                            <Text size="sm" color="dimmed" weight={400}>
                                            {translate("TEMPLATE_EDITOR_SAVEOPTIONS_DESCRIPTION")}
                                            </Text>
                                        </div>
                                    </Group>
                                </Accordion.Control>
                                <Accordion.Panel>
                                </Accordion.Panel>
                            </Paper>
                        </Accordion.Item>
                        
                        <Accordion.Item value="versions">
                            <Paper>
                                <Accordion.Control p="xs"> 
                                    <Group noWrap>
                                        <IconGitBranch size={24} />
                                        <div>
                                            <Text>{translate("TEMPLATE_EDITOR_VERSION_TITLE")}</Text>
                                            <Text size="sm" color="dimmed" weight={400}>
                                            {translate("TEMPLATE_EDITOR_VERSION_DESCRIPTION")}
                                            </Text>
                                        </div>
                                    </Group>
                                </Accordion.Control>
                                <Accordion.Panel>
                                    <Timeline active={2} reverseActive bulletSize={24} lineWidth={2}>
                                        <Timeline.Item bullet={<IconGitCommit size={12} />} title={
                                            <div>Päivitys #12354 <Badge>Kehitys versio</Badge></div>
                                        } lineVariant="dashed">
                                        <Text color="dimmed" size="sm"><Text variant="link" component="span" inherit>Jani Sundqvist</Text> päivitti mallia</Text>
                                            <Text size="xs" mt={4}>15 minutes ago</Text>
                                        </Timeline.Item>

                                        <Timeline.Item bullet={<IconGitCommit size={12} />} title="Päivitys #12353" lineVariant="dashed">
                                        <Text color="dimmed" size="sm"><Text variant="link" component="span" inherit>Jani Sundqvist</Text> päivitti mallia</Text>
                                            <Text size="xs" mt={4}>42 minutes ago</Text>
                                        </Timeline.Item>

                                        <Timeline.Item bullet={<IconGitPullRequest size={12} />} title={
                                            <div>Julkaisu #12351 <Badge color="green">Julkinen versio</Badge></div>
                                        }>
                                        <Text color="dimmed" size="sm"><Text variant="link" component="span" inherit>Jani Sundqvist</Text> julkaisi version #12351</Text>
                                            <Text size="xs" mt={4}>50 minutes ago</Text>
                                        </Timeline.Item>

                                        <Timeline.Item bullet={<IconGitCommit size={12} />} title="Päivitys #12351">
                                        <Text color="dimmed" size="sm"><Text variant="link" component="span" inherit>Jani Sundqvist</Text> päivitti mallia</Text>
                                            <Text size="xs" mt={4}>52 minutes ago</Text>
                                        </Timeline.Item>

                                        <Timeline.Item title="Malli luotu" bullet={<IconMessageDots size={12} />}>
                                            <Text color="dimmed" size="sm"><Text variant="link" component="span" inherit>Jani Sundqvist</Text> loi mallin</Text>
                                            <Text size="xs" mt={4}>noin tunti sitten</Text>
                                        </Timeline.Item>
                                    </Timeline>
                                </Accordion.Panel>
                            </Paper>
                        </Accordion.Item>
                        <Accordion.Item value="json">
                            <Paper>
                                <Accordion.Control p="xs">
                                    <Group noWrap>
                                        <IconCode size={24} />
                                        <div>
                                            <Text>{translate("TEMPLATE_EDITOR_RAWJSON_TITLE")}</Text>
                                            <Text size="sm" color="dimmed" weight={400}>
                                            {translate("TEMPLATE_EDITOR_RAWJSON_DESCRIPTION")}
                                            </Text>
                                        </div>
                                    </Group>
                                </Accordion.Control>
                                <Accordion.Panel>
                                    <ScrollArea.Autosize maxHeight={600} sx={{ maxWidth: 400 }} mx="auto">
                                        <Prism language="json" sx={{ width: 390 }}>
                                            {JSON.stringify(data, null, 2)}
                                        </Prism>
                                    </ScrollArea.Autosize>
                                </Accordion.Panel>
                            </Paper>
                        </Accordion.Item>
                    </Accordion>
                </Grid.Col>
            </DragDropContext>
        </Grid>
    </div>
  );
}

/**
 * Drag and drop dosn't support Server Side Rendering very good. Render on client.
 */
export default dynamic(() => Promise.resolve(FormEditor), { 
    ssr: false 
})