import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IManagerLines } from '../iManagerLines';

@Injectable()
export class ManagerLinesService {
    managerLines: string[] = [
        "UNDEF", 
        "Essai P35", 
        "Essai P28", 
        "Essai P20", 
        "Essai P30", 
        "Essai P19/22", 
        "Essai P18",
        "Essai FL",
        "Prod Green",
        "Prod Cabine",

    ];
    constructor(private http: HttpClient) { }

    getProductsSmall(){
        return this.http.get<any>('assets/products-small.json')
        .toPromise()
        .then(res => <IManagerLines[]>res.data)
        .then(data => { return data; });
    }

    generateManager(): IManagerLines {
        const manager: IManagerLines =  {
            id: this.generateId(),
            line: 'UNDEF',
            day: '',
            night: '',
            vsd: ''
        };
        return manager;
    }

    generateId() {
        let text = "";
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        
        for (var i = 0; i < 5; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        
        return text;
    }

    generateLines() {
        return this.managerLines[Math.floor(Math.random() * Math.floor(30))];
    }
}