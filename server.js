const CONFIG = require('./config.js')

const http = require('http')
const url = require('url')
const eventproxy = require('eventproxy')
const charset = require('superagent-charset')
const superagent = charset(require('superagent'))
const cheerio = require('cheerio')
const async = require('async')

const ep = new eventproxy()


const BASE_URL = CONFIG.ROOT_URL + "/bbmusic/erge" 
const PAGE_SONGS_COUNT = 90 //每页的歌曲链接数量


const fetchUrl = ({url,referer='http://www.baobao88.com/',callback})=>{
	superagent.get(url)
	.set({'Referer':referer})
	.charset('gbk')
	.end((err, pageBody)=>{
		if(err){
			console.log(err)
		}
		typeof callback == 'function' && callback(pageBody, url)
	})
}

const getRealMp3Addr = (pageBody)=>{
	const $= cheerio.load(pageBody.text,{decodeEntities: false})
	return $('body').html().match(/mp3:"[\s|\S]+\.mp3"/)[0]
}

const start = ()=>{

	const startTime = +new Date()

	fetchUrl({
		url: BASE_URL,
		callback:(pageBody)=>{

			const $ = cheerio.load(pageBody.text),
 					song_page_list = [],//歌曲列表的所有页面
 					song_page_count = $('.nlist_page').children("a:last-child").attr('href').slice(3, -5)

 			song_page_list.push(BASE_URL)
 			for(var i=2; i<song_page_count; i++){
 				song_page_list.push(BASE_URL+'/15_'+i+'.html')
 			}
 			// ------------------------已经获取到所有歌曲列表页面------------------------------

 			async.mapLimit(song_page_list.splice(0,5),3,(url, back)=>{

 				//现在开始按顺序请求歌曲列表页  获取所有 歌曲详情页的链接
 				console.log('现在请求的是歌曲列表：'+url)
 				let count = 0
 				fetchUrl({
 					url: url,
 					callback:(pageBody)=>{
 						count++
 						console.log('现在并发是：'+ count)
 						const delay = parseInt((Math.random() * 10000000) % 2000, 10);

 						const $ = cheerio.load(pageBody.text)

 						const songDetailPageInfo = []
 						$('.list_right_nr1 a').each(function(i, item){
 							const song_info = {}
 							song_info.timestamp = +new Date() 
 							song_info.aid = $(this).prev().val()
 							song_info.title = $(this).text().trim()
 							song_info.href = CONFIG.ROOT_URL + $(this).attr('href').trim()
 							song_info.mp3_href = 'http://www.baobao88.com/au_play.php?id='+ song_info.aid 
 							songDetailPageInfo.push(song_info)
 						})

 						setTimeout(()=>{
 							count--
 							back(null,songDetailPageInfo)
 						},delay)

 					}
 				})
 			},(err, result)=>{
 				if(err){
 					return err
 				}
 				console.log('歌曲列表页爬取完毕，接下来要搞具体的歌曲信息了')

 				const _result = []
 				result.forEach((item)=>{
					item.forEach((_item)=>{
						_result.push(_item)
					})
				})
 				console.log('-------------------------------')
 				
 				// 已经获取到所有歌曲的信息：_result  接下来要分别爬取两个url  一个获取gc 一个获取MP3真实地址
 				//从_result中整理出这两个 url 的数组
 				const detail_page_urls = _result.map((item)=>{
 						return item['href']
 				})
 				const song_hrefs = _result.map((item)=>{
 					return item['mp3_href']
 				})

 				const task1 = (done)=>{
 					let count = 0
 					async.mapLimit(detail_page_urls,3,(url,callback)=>{
 						fetchUrl({
 							url:url,
 							referer:url,
 							callback:(pageBody,url)=>{
 							console.log('正在获取 '+url+ '来得到歌词')
 							count++
 							console.log('现在并发是：'+ count)
 							const delay = parseInt((Math.random() * 10000000) % 2000, 10);

 							const $ = cheerio.load(pageBody.text)
 							const mp3_gc = $('.t_mp3_gc').html()
	
 							for(var i=0; i<_result.length; i++){
 								if(_result[i]['href'] == url){
 									_result[i]['mp3_gc'] = mp3_gc
 								}
 							}

 							setTimeout(()=>{
 								count--
 								callback(null,_result)
 							},delay)


 						}
 						})
 					},(err, result)=>{
 						if(err){
 							console.log(err)
 						}
 						console.log('添加歌词完事了')
 						console.log(_result)
 						done(null,result)
 					})
 				}
 				const task2 = (done)=>{
 					let count = 0
 					async.mapLimit(song_hrefs,3,(url,callback)=>{
 						fetchUrl({
 							url:url,
 							referer:url,
 							callback:(pageBody,url)=>{

 							count++
 							console.log('现在并发是：'+ count)
 							const delay = parseInt((Math.random() * 10000000) % 2000, 10);
 							console.log('正在获取 '+url+ '来得到MP3真实地址')

 							const rel_href = getRealMp3Addr(pageBody)
 							for(var i=0; i<_result.length; i++){
 								if(_result[i]['mp3_href'] == url){
 									_result[i]['mp3_rel_href'] = rel_href
 								}
 							}

 							setTimeout(()=>{
 								count--
 								callback(null,_result)
 							},delay)

 						}
 						})
 					},(err, result)=>{
 						if(err){
 							console.log(err)
 						}
 						console.log('添加歌词完事了')
 						done(null,result)
 					})
 				}

				async.parallel({
				    one:task1,two:task2
				}, function (err, results) {
						console.log(_result)
				    console.log('都完事了！！！')
				    const endTime = +new Date()
				    const useTime = (endTime-startTime)/1000 + '秒'
				    console.log(useTime)
				}); 				


 			})

		}
	})
}



module.exports = {
	start
}