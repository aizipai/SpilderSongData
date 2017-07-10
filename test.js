var arr = [
	[{ timestamp: 1499679963852,
    aid: '166861',
    title: '爱乘以无限大（赵天鸽）',
    href: 'http://www.baobao88.com/bbmusic/erge/07/17166861.html',
    mp3_href: 'http://www.baobao88.com/au_play.php?id=166861' },
  { timestamp: 1499679963853,
    aid: '166860',
    title: '爱的歌（赵天鸽）',
    href: 'http://www.baobao88.com/bbmusic/erge/07/17166860.html',
    mp3_href: 'http://www.baobao88.com/au_play.php?id=166860' } ],
    [{ timestamp: 1499679963852,
    aid: '166861',
    title: '爱乘以无限大（赵天鸽）',
    href: 'http://www.baobao88.com/bbmusic/erge/07/17166861.html',
    mp3_href: 'http://www.baobao88.com/au_play.php?id=166861' },
  { timestamp: 1499679963853,
    aid: '166860',
    title: '爱的歌（赵天鸽）',
    href: 'http://www.baobao88.com/bbmusic/erge/07/17166860.html',
    mp3_href: 'http://www.baobao88.com/au_play.php?id=166860' } ],
    [{ timestamp: 1499679963852,
    aid: '166861',
    title: '爱乘以无限大（赵天鸽）',
    href: 'http://www.baobao88.com/bbmusic/erge/07/17166861.html',
    mp3_href: 'http://www.baobao88.com/au_play.php?id=166861' },
  { timestamp: 1499679963853,
    aid: '166860',
    title: '爱的歌（赵天鸽）',
    href: 'http://www.baobao88.com/bbmusic/erge/07/17166860.html',
    mp3_href: 'http://www.baobao88.com/au_play.php?id=166860' } ]

]
var _arr = []
arr.forEach((item)=>{
	item.forEach((_item)=>{
		_arr.push(_item)
	})
})
console.log(_arr)