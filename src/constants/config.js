import { Dimensions, Platform } from 'react-native'

const window = Dimensions.get('window');
export const width = (pers) => {
    return pers / 100 * window.width
}
export const height = (pers) => {
    return pers / 100 * window.height
}

export const widthForOr = (initialOrientationKey, orientationkey) => initialOrientationKey == 'PORTRAIT'
    ? orientationkey == 'PORTRAIT' ? width : height
    : orientationkey == 'PORTRAIT' ? height : width


export const heightForOr = (initialOrientationKey, orientationkey) => initialOrientationKey == 'PORTRAIT'
  ? orientationkey == 'PORTRAIT' ? height : width
  : orientationkey == 'PORTRAIT' ? width : height

export const demWidth = Dimensions.get('window').width
export const demHeight = Dimensions.get('window').height

export const dbName = 'sugar_lor.db'
export const googleApiKey = 'AIzaSyChTh1OYYieC0SaN-k5GhvmMBEeXQbUow4'

export const iconImages = {
	repeatBlack: require('images/repeat_black.png'),
	shuffleBlack: require('images/shuffle_black.png'),
	playWhite: require('images/play_white.png'),
	poundBox: require('images/pound_box.png')
}

export const menuItems = [
	{
		icone: null,
		image: iconImages.playWhite,
		text: 'Your repeats',
		action: 'Main'
	},
	{
		icone: null,
		image: null,
		text: 'coming soon',
		action: 'no'
	},
]

export const helpers = {
	popupPlayrIcon: {
		show: true,
		type: 'notify',
		text: 'Tap the popup icon next to watch videos outside the app',
		btns: [
			{
				text: 'OK',
				action: 'hide'
			}
		]
	},
	tutorial: {
		show: true,
		type: 'story',
		items: [
			{
				key: 'swipeLeftOrRight',
				text: 'Swipe left or right to remove your recent repeats',
				icon: {
					type: 'swipe',
					image: require('images/swipe_right.png'),
					action: 'left|right',
					height: 20,
          width: 20
				},
				btns: [
					{
						text: 'Got it',
						action: 'next'
					}
				]
			},
			{
				key: 'dragAndDrop',
				text: 'Drag and drop your repeat counter to reorganize your playlist',
				icon: {
					type: 'drag',
					image: require('images/dragg_tutor.png'),
					action: 'bottom|top',
					height: 30,
          width: 80
				},
				btns: [
					{
						text: 'Got it',
						action: 'hide'
					}
				]
			}
		]
	}
}

export const autoComleteUrl = 'http://suggestqueries.google.com/complete/search?'

export const searchVideosUrl = 'http://listenonrepeat.com/v2/search/query/?'
export const searchVideoYoutubeUrl = 'https://www.googleapis.com/youtube/v3/search?'
export const getVideosData = 'https://www.googleapis.com/youtube/v3/videos?'

export const youtubeThumbUrl = 'https://img.youtube.com/vi/'

export const createTableQuery = 'CREATE TABLE IF NOT EXISTS VIDEO_DATA(ID INTEGER PRIMARY KEY, AUTHOR TEXT, BLOGNAME TEXT, BLOGPOSTURL TEXT, DESCRIPTION TEXT, DURATION INTEGER, H263_URL TEXT, HQ_URL TEXT, IDYOUTUBE TEXT, MPEG4_URL TEXT, POSITION INTEGER, REPEATES INTEGER, THUMBNAILURL TEXT, TITLE TEXT, UPDATED TEXT, URLVIDEO2 TEXT, VIEW_COUNT INTEGER)'
