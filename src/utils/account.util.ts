export const sortDataByTimeline = (data: any) => {
    const result: any = {};
    data.map((item: any) => {
        const date = new Date(item.type === 'drop' ? item?.drop?.created_at : item?.created_at)
        const key = isTodayOrYesterday(date);
        result[key] = [...(result[key] || []), item];
    });
    console.log(result);
    return result;
}

export const checkClassNameAccountItem = (itemIdx: number, data: Array<any>, dataIdx: number, userData: any) => {
    return itemIdx + 1 === data.length ? ''
        : (dataIdx + 1) === Object.entries(userData).length ? 'h-9' : 'h-16';
}

export const getTime = (date: string) => {
    const time = new Date(date);
    return time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
}

const isTodayOrYesterday = (date: any) => {
    const today = new Date()
    const target = new Date(date);
    const diff = today.getTime() - target.getTime();
    const dayDiff = diff / (1000 * 3600 * 24);
    if (dayDiff < 1) {
        return 'Today';
    } else if (dayDiff < 2) {
        return 'Yesterday';
    } else {
        return `${target.getDate()}-${target.getMonth() + 1}-${target.getFullYear()}`
    }
};