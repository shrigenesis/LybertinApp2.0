
function HtmlToText(html) {
    let data = html.replace(/<[^>]+>/g, '');
    data = data.replace('&#39;', ' ');
    data = data.replace('&nbsp;', ' ');

    return data;
}
export default HtmlToText