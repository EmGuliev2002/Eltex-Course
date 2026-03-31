import { initialPosts } from './initialPosts.js'

class BlogData {
	storageKey = 'ryan_gosling_blog'

	constructor() {
		const rawData = localStorage.getItem(this.storageKey)
		this.posts = rawData ? JSON.parse(rawData) : initialPosts
		if (!rawData) this.save()
	}

	save() {
		localStorage.setItem(this.storageKey, JSON.stringify(this.posts))
	}

	addPost(data) {
		this.posts.unshift(data)
		this.save()
	}

	deletePost(id) {
		this.posts = this.posts.filter(post => post.id !== Number(id))
		this.save()
	}

	shapePostObj(title, text, img) {
		return {
			id: Date.now(),
			title,
			text,
			date: new Date().toLocaleDateString('ru-RU', {
				day: 'numeric',
				month: 'long',
				year: 'numeric',
			}),
			img: img || 'assets/rickroll.jpg',
		}
	}
}

export const blogData = new BlogData()
