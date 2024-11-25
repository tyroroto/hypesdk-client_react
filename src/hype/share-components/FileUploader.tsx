// ** React Imports
import {useState, Fragment, useEffect, useContext} from 'react'

// ** Reactstrap Imports
import {Card, CardBody, Button, ListGroup, ListGroupItem} from 'reactstrap'

// ** Third Party Imports
import {useDropzone} from 'react-dropzone'
import {X, DownloadCloud, FileText} from 'react-feather'
import useBoundStore from "../../stores";
import {HypeFormContext} from "../contexts/hypeFormContext";

interface FileUploadInterface {
    url: string,
    name: string,
    id: number,
    size: number
}

const FileUploader = (args: { inputValue?: { id: number, filename:string, url: string, mimetype: string, size: number }[], onChange: (s: string,a: any) => void }) => {
    const activeForm = useContext(HypeFormContext)
    const apiUrl = useBoundStore(state => state.app.apiUrl)
    const {inputValue, onChange} = args;
    // ** State
    const [files, setFiles] = useState<Array<FileUploadInterface>>([])
    const [currentCompKey, setCurrentCompKey] = useState<string | null>(null)
    // this component will not rerender if compKey not change
    useEffect(() => {
        // console.log(compKey)
        // console.log(currentCompKey)
        // if (compKey !== currentCompKey) {
        if (inputValue != null) {
            const parsedInitFile = [];
            for (const f of inputValue) {
                const tf = {
                    ...f,
                    url: `${apiUrl}/forms/${activeForm.form.id}/records/${activeForm.record.id}/viewfile/${f.id}`,
                    type: f.mimetype,
                    name: `${f.id} - ${f.filename}`
                };
                parsedInitFile.push(tf);
            }
            setFiles(parsedInitFile);
            // setCurrentCompKey(compKey);
        }
        // }
    }, [inputValue])

    const {getRootProps, getInputProps} = useDropzone({
        onDrop: acceptedFiles => {
            const newFileArr = [...files, ...acceptedFiles.map(file => Object.assign(file))];
            setFiles(newFileArr)
            onChange('onChange', {files: inputValue, localFiles: newFileArr, newFiles: acceptedFiles})
        }
    })

    const renderFilePreview = (file: any | FileUploadInterface) => {
        if(file.mimetype?.includes('image') || file.type?.includes('image')){
            return <ImageFetcher fileId={file?.id} file={file} name={file.name} url={file.url}/>
        } else {
            return <FileText size='28'/>
        }
    }

    const handleRemoveFile = (file: FileUploadInterface) => {
        const uploadedFiles = files
        if (file.id != null) {
            const filtered = uploadedFiles.filter(i => i.name !== file.name)
            setFiles([...filtered])
            onChange('onRemove', {files: filtered.filter(f => f.id != null), removeFile: file})
        } else {
            const filtered = uploadedFiles.filter(i => i.name !== file.name)
            setFiles([...filtered])
            onChange('onRemoveNewFile', {removeFile: file})
        }
    }

    const renderFileSize = (size: number) => {
        if (Math.round(size / 100) / 10 > 1000) {
            return `${(Math.round(size / 100) / 10000).toFixed(1)} mb`
        } else {
            return `${(Math.round(size / 100) / 10).toFixed(1)} kb`
        }
    }

    const fileList = files.map((file, index) => (
        <ListGroupItem key={`${file.name}-${index}`} className='d-flex align-items-center justify-content-between'>
            <div className='file-details d-flex align-items-center'>
                <div className='file-preview me-1'>{renderFilePreview(file)}</div>
                <div>
                    <p className='file-name mb-0'>{file.name}</p>
                    <p className='file-size mb-0'>{renderFileSize(file.size)}</p>
                </div>
            </div>
            <Button color='danger' outline size='sm' className='btn-icon' onClick={() => handleRemoveFile(file)}>
                <X size={14}/>
            </Button>
        </ListGroupItem>
    ))

    const handleRemoveAllFiles = () => {
        setFiles([])
    }

    return (
        <Card>
            <CardBody>
                <div {...getRootProps({className: 'dropzone'})}>
                    <input {...getInputProps()} />
                    <div className='d-flex align-items-center justify-content-center flex-column'>
                        <DownloadCloud size={64}/>
                        <h5>Drop Files here or click to upload</h5>
                        <p className='text-secondary'>
                            Drop files here or click{' '}
                            <a href='/' onClick={e => e.preventDefault()}>
                                browse
                            </a>{' '}
                            thorough your machine
                        </p>
                    </div>
                </div>
                {files.length ? (
                    <Fragment>
                        <ListGroup className='my-2'>{fileList}</ListGroup>
                        <div className='d-flex justify-content-end'>
                            <Button className='me-1' color='danger' outline onClick={handleRemoveAllFiles}>
                                Remove All
                            </Button>
                            {/*<Button color='primary'>Upload Files</Button>*/}
                        </div>
                    </Fragment>
                ) : null}
            </CardBody>
        </Card>
    )
}

export default FileUploader

export const ImageFetcher = (props: { fileId?: number, name: string, url: string, file?: Blob }) => {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const auth = useBoundStore(state => state.auth)
    useEffect(() => {
        const fetchImageWithToken = async () => {
            try {
                if(props.fileId == null && props.file != null){
                    console.log(props)
                    const blobUrl = URL.createObjectURL(props.file);
                    setImageSrc(blobUrl);
                    return;
                }
                const response = await fetch(props.url, {
                    headers: {
                        'Authorization': `Bearer ${auth.accessToken}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch image');
                }

                const blob = await response.blob();
                const blobUrl = URL.createObjectURL(blob);
                setImageSrc(blobUrl);
            } catch (error) {
                console.error('Error fetching image:', error);
            }
        };

        fetchImageWithToken();
    }, [props.url]);

    return (
        <div>
            {imageSrc ? (
                <img className='rounded' alt={props.name} src={imageSrc}
                     height='28' width='28'/>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

