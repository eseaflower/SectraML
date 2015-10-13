/// <reference path="../typings/tsd.d.ts"/>

export class AjaxHelper {
	public post(url, data):JQueryXHR {
		var serialized = JSON.stringify(data);
		var deferredHandle = $.post(url, {args:serialized});
		return deferredHandle;
	}
}

class FileUpload {
	public upload(uploadUrl:string, file:File):JQueryXHR {
		var formData = new FormData();
		formData.append("datafile", file);		 
		var deferredHandle = $.ajax({
			url: uploadUrl,
			data: formData,
			contentType: false, // Needed to prevent jquery from messing with the data
			processData: false, // Needed to prevent jquery from messing with the data
			type: 'POST'
    	});					
		return deferredHandle;	
	}
}


interface XHRDoneCallback<T> {
	(data?:T, textStatus?:string, jqXHR?:JQueryXHR):void;
}
interface XHRFailCallback {
	(jqXHR?:JQueryXHR, textStatus?:string, errorThrown?:Error):void;
}
interface XHRAlwaysCallback<T> {
	(dataOrXHR?:T|JQueryXHR, textStatus?:string, XHROrError?:JQueryXHR|Error):void;
}

export class TypedXHR<T> {
	private wrapped:JQueryXHR;
	constructor(wrapped:JQueryXHR) {
		this.wrapped = wrapped;
	}	
	public asXHR():JQueryXHR {
		return this.wrapped;
	}
	public done(callback:XHRDoneCallback<T>):TypedXHR<T> {				 
		return new TypedXHR<T>(this.wrapped.done(
			(data?:string, textStatus?:string, jqXHR?:JQueryXHR)=> {
				var deserialized:T = null;
				if (data !== null) {
					deserialized = JSON.parse(data);
				}				 							
				callback(deserialized, textStatus, jqXHR);
			}) as JQueryXHR);			 
	}
	public fail(callback:XHRFailCallback):TypedXHR<T> {
		return new TypedXHR<T>(this.wrapped.fail(callback) as JQueryXHR);
	}
	public always(callback:XHRAlwaysCallback<T>):TypedXHR<T> {				 
		return new TypedXHR<T>(this.wrapped.always(callback) as JQueryXHR);
	}

}

export function postJson<T>(url, data):TypedXHR<T> {
	return new TypedXHR<T>(new AjaxHelper().post(url, data));
}

export function uploadFile<T>(url:string, file:File) {
	return new TypedXHR<T>(new FileUpload().upload(url, file));
}