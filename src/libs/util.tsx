export const getHomeRouteForLoggedInUser = (userRoles: {slug: 'admin' | 'user'| 'string'}[]) => {
    if(userRoles.find( ur => ur.slug == 'admin') != null){
        return '/console/forms'
    }
    if(userRoles.length > 0){
        return '/console/forms'
    }
    // if (userRole.slug === 'client') return '/access-control'
    return '/access-control'
}
export enum AppModeType {
    READONLY='READONLY',
    EDITOR = 'EDITOR',
    NORMAL = 'NORMAL',
}

export const INPUT_RENDER_MODE = {
    EDITOR: 'EDITOR',
    NORMAL: 'NORMAL',
    READONLY: 'READONLY',
}

export const APP_MODE = {
    EDITOR:'EDITOR',
    NORMAL: 'NORMAL',
};

export const FORM_MODE = {
    READONLY: 'READONLY',
    NORMAL: 'NORMAL',
}
// ** React Select Theme Colors
export const selectThemeColors = (theme: any) => ({
    ...theme,
    colors: {
        ...theme.colors,
        primary25: '#7367f01a', // for option hover bg-color
        primary: '#7367f0', // for selected option bg-color
        neutral10: '#7367f0', // for tags bg-color
        neutral20: '#ededed', // for input border-color
        neutral30: '#ededed' // for input hover border-color
    }
})

export const findRootNode = (layoutItems: Array<any>) => {
    const rootList = [];
    for (const ld of layoutItems) {
        let foundInChild = false;
        for (const nld of layoutItems) {
            if (nld.children.find( (c: any) => c == ld.id) != null) {
                foundInChild = true;
                break;
            }
        }
        if (!foundInChild) {
            rootList.push(ld.id);
        }
    }
    return rootList
}


export const parseExpressionList = (expString: string, rmBracket = true) : Array<string> => {
    const scriptListKey = expString.match(/({)([A-Za-z0-9_!"#$%&'()*+,./:;<=>?@\\^`{|}~-]{0,300})(})/g);
    let result: Array<string> = [];
    if (scriptListKey != null) {
        if (rmBracket) {
            for (const s of scriptListKey) {
                result.push(s.substring(1, s.length - 1))
            }
        } else {
            result = [...scriptListKey];
        }
    }
    return result;
}

export const parseSlug = (
    stringInp: string
) => {
    stringInp = stringInp.trim().toLowerCase()
    stringInp = stringInp.replace(/\s+/g, '_').toLowerCase();
    return stringInp.replace(/[^a-z0-9_]/gi, '');
};


/**
 ** Format and return date in Humanize format
 ** Intl docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/format
 ** Intl Constructor: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
 * @param {String} value date to format
 * @param {Object} formatting Intl object to format with
 */
export const formatDate = (value: string, formatting: Intl.DateTimeFormatOptions = {month: 'short', day: 'numeric', year: 'numeric'}) => {
    if (!value) return value
    return new Intl.DateTimeFormat('en-US', formatting).format(new Date(value))
}


// ** Checks if the passed date is today
const isToday = (date: Date) => {
    const today = new Date()
    return (
        /* eslint-disable operator-linebreak */
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
        /* eslint-enable */
    )
}

// ** Returns short month of passed date
export const formatDateToMonthShort = (value: Date, toTimeForCurrentDay = true) => {
    const date = new Date(value)
    let formatting: Intl.DateTimeFormatOptions  = {month: 'short', day: 'numeric'}

    if (toTimeForCurrentDay && isToday(date)) {
        formatting = {hour: 'numeric', minute: 'numeric'}
    }

    return new Intl.DateTimeFormat('en-US', formatting).format(new Date(value))
}
