class Header {
    private authorization: string;
    private contentType: string;

    constructor(authorization: string, contentType: string){
        this.authorization = authorization;
        this.contentType = contentType;
    }

    getHeader(){
        return { 
            'Authorization': this.authorization, 
            'Content-Type': this.contentType
        }
    }
}

export class Config {
    private _method: string;
    private _url: string;
    private _headers: Header;
    private _data: object;

    constructor(method: string, url: string, authToken: string, contentType: string, data: object) {
        this._method = method;
        this._url = url;
        this._headers = new Header(authToken, contentType);
        this._data = data;
    }

    getObjConfig(){
        return {
            method: this._method,
            url: this._url,
            headers: this._headers,
            data : this._data
        };
    }
}


