import { BASE_URL } from "./constants";
import { Article } from "./types";
function create_UUID(){
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
}

async function post_article(article: Article) {
    const response = await fetch(`${BASE_URL}/api/article`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(article)
    });
    return response.json();
}

async function get_articles(): Promise<Article[]> {
    const response = await fetch(`${BASE_URL}/api/article`);
    return response.json();
}

async function get_article(id: string) {
    const response = await fetch(`${BASE_URL}/api/article/${id}`);
    return response.json();
}

async function put_article(article: Article) {
    const response = await fetch(`${BASE_URL}/api/article/${article.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(article)
    });
    return response.json();
}


export { create_UUID, post_article  , get_articles, get_article, put_article };
