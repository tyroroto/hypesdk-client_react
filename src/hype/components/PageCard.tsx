export const PageCard = (props: any) => {
    return <div
        {...props}
        className={'page-card'}>{props.children}</div>
}