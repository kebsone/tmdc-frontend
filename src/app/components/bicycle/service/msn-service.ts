import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class MsnService {

    msnGroups: any[] = [
    {
      title: "UNDEF",
      subtitle1:"GTI",
      subtitle2:"Titre",
      id: "todo",
      msn: [
        {
          id: 0,
          title: "5498877",
          description: "FONCTIONNEL"
        },
        {
          id: 1,
          title: "0002394",
          description: "3 CALL"
        },
        {
          id: 2,
          title: "1112384",
          description: "S3TEST"
        },
        {
          id: 1,
          title: "0002394",
          description: "PAXS 3"
        },
        {
          id: 2,
          title: "1112384",
          description: "SLIDE 2 TEST"
        },
        {
          id: 1,
          title: "0002394",
          description: "PAXS 3"
        },
        {
          id: 2,
          title: "1112384",
          description: "STEST"
        },
        {
          id: 1,
          title: "0002394",
          description: "PAXS 2"
        },
        {
          id: 2,
          title: "1112384",
          description: "SLIDE FINAL "
        },
        {
          id: 1,
          title: "0002394",
          description: "PAXS "
        },
        {
          id: 2,
          title: "1112384",
          description: "SLIDE 1"
        }
      ]
    },
    {
      title: "Essai P35",
      subtitle1:"GTI",
      subtitle2:"Titre",
      id: "inProgress",
      msn: [
        
      ]
    },
    {
      title: "Essai P28",
      subtitle1:"GTI",
      subtitle2:"Titre",
      id: "done",
      msn: [
       
      ]
    },
    {
      title: "Essai P20",
      subtitle1:"GTI",
      subtitle2:"Titre",
      id: "done",
      msn: [
       
      ]
    },
    {
      title: "Essai P30",
      subtitle1:"GTI",
      subtitle2:"Titre",
      id: "done",
      msn: [
      
      ]
    },
    {
      title: "Essai P19/22",
      subtitle1:"GTI",
      subtitle2:"Titre",
      id: "done",
      msn: [
      
      ]
    },
    {
      title: "Essai P18",
      subtitle1:"GTI",
      subtitle2:"Titre",
      id: "done",
      msn: [
        
      ]
    },
    {
      title: "Essai FL",
      subtitle1:"GTI",
      subtitle2:"Titre",
      id: "done",
      msn: [
        
      ]
    },
    {
      title: "Prod Green",
      subtitle1:"GTI",
      subtitle2:"Titre",
      id: "done",
      msn: [
        
      ]
    },
    {
      title: "Prod Cabine",
      subtitle1:"GTI",
      subtitle2:"Titre",
      id: "done",
      msn: [
        
      ]
    }
  ];

  taskGroupsSubject = new Subject<any[]>();

  constructor() { }

  emitTaskGroups() {
    this.taskGroupsSubject.next(this.msnGroups);
  }
}