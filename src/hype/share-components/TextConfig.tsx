import {Button, ButtonGroup} from 'reactstrap'
import {AlignCenter, AlignLeft, AlignRight, Bold, Italic, Underline} from "react-feather";
import {useEffect} from "react";

export interface ITextConfig {
    fontSize: number,
    align?: string,
    bold?: boolean,
    italic?: boolean,
    underline?: boolean,
    tag?: string,
}
const TextConfig = (props: {change: (c: ITextConfig) => void, value: ITextConfig}) => {
    const {change, value} = props;

    useEffect( () => {
        if(props.value?.tag == null){
            onChange('tag', 'div')
        }
    },[props.value?.tag]);

    const onChange = (type: string, val = '') => {
        const config = {
            fontSize: value?.fontSize ? value?.fontSize : 16,
            align: value?.align ? value?.align : '',
            bold: value?.bold ? value?.bold : false,
            italic: value?.italic ? value?.italic : false,
            underline: value?.underline ? value?.underline : false,
            tag: value?.tag ? value?.tag : 'fix',
        };
        switch (type) {
            case 'fontSize':
                config.fontSize = parseInt(val);
                break;
            case 'tag':
                config.tag = val;
                break;
            case 'align':
                config.align = val;
                break;
            case 'bold':
                config.bold = !config.bold;
                break;
            case 'italic':
                config.italic = !config.italic;
                break;
            case 'underline':
                config.underline = !config.underline;
                break;
            default:
                break;
        }
        change(config);
    };
    return (
        <ButtonGroup className={'mb-1 zindex-0'} style={{width:'100%', backgroundColor:"white"}} >
            <select style={{width:54, backgroundColor:"white", borderTopLeftRadius: 5, borderBottomLeftRadius: 5}}
                     onChange={e => {
                         onChange('tag', e.target.value)
                     }}
                     value={value?.tag != null ? value.tag : 'div'}
            >
                <option value='div'>fix</option>
                <option value='h1'>h1</option>
                <option value='h2'>h2</option>
                <option value='h3'>h3</option>
                <option value='h4'>h4</option>
                <option value='h5'>h5</option>
                <option value='h6'>h6</option>
            </select>
            <select  style={{width:54, backgroundColor:"white"}}
                    onChange={e => {
                        onChange('fontSize', e.target.value)
                    }}
                    disabled={value?.tag != 'div'}
                    value={value?.fontSize ? value?.fontSize : 16}
            >
                <option value='12'>12</option>
                <option value='14'>14</option>
                <option value='16'>16</option>
                <option value='18'>18</option>
                <option value='20'>20</option>
                <option value='22'>22</option>
                <option value='24'>24</option>
                <option value='26'>26</option>
                <option value='28'>28</option>
                <option value='30'>30</option>
                <option value='32'>32</option>
                <option value='34'>34</option>
                <option value='36'>36</option>
                <option value='38'>38</option>
                <option value='40'>40</option>
            </select>
            <Button  style={{maxWidth:48}} color='primary' className={`button-no-focus`} size={'sm'} onClick={() => onChange('align', 'left')}
                   outline={value?.align !== 'left'}>
                <AlignLeft/>
            </Button>
            <Button  style={{maxWidth:48}} color='primary' className={`button-no-focus`} size={'sm'} onClick={() => onChange('align', 'center')}
                    outline={value?.align !== 'center'}>
                <AlignCenter/>
            </Button>
            <Button  style={{maxWidth:48}} color='primary' className={`button-no-focus`}  size={'sm'} onClick={() => onChange('align', 'right')}
                    outline={value?.align !== 'right'}>
                <AlignRight/>
            </Button>
            <Button  style={{maxWidth:48}} color='primary' className={`button-no-focus`} size={'sm'} onClick={() => onChange('bold')}
                     outline={!value?.bold}>
                <Bold/>
            </Button>
            <Button style={{maxWidth:48}} color='primary' className={`button-no-focus`} size={'sm'} onClick={() => onChange('italic')}
                    outline={!value?.italic}>
                <Italic/>
            </Button>
            <Button style={{maxWidth:48}} color='primary' outline={!value?.underline} className={`button-no-focus`} size={'sm'} onClick={() => onChange('underline')}
                    >
                <Underline/>
            </Button>
        </ButtonGroup>
    );
}
export default TextConfig
