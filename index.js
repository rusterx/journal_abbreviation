var zoteroPane = Zotero.getActiveZoteroPane();
var selectedItems = zoteroPane.getSelectedItems();

var url = 'https://public-1251110281.cos.ap-shanghai.myqcloud.com/jnls.json';
var data = Zotero.File.getContentsFromURL(url);
var jnlList = JSON.parse(data);

var ignoreItems = new Array();

var specialJnls = new Array(
    'The Journal of Physical Chemistry Letters',
    'The Journal of Physical Chemistry A',
    'The Journal of Physical Chemistry B',
    'The Journal of Physical Chemistry C',
    'The Journal of Chemical Physics'
)


Array.from(selectedItems).forEach(async (v, i) => {
    var jnl = v.getField('publicationTitle');

    // 这几个奇怪的期刊，需要去掉The
    if (specialJnls.includes(jnl)) {
        jnl = jnl.replace('The ', '');
        v.setField('publicationTitle', jnl);
        await v.saveTx();
    }

    // 更新期刊的缩写
    if (jnlList.hasOwnProperty(jnl)) {
        v.setField('journalAbbreviation', jnlList[jnl])
        await v.saveTx();
    } else {
        ignoreItems.push({
            'key': v.getField('key'),
            'publicationTitle': jnl
        });
    }
});

return ignoreItems;