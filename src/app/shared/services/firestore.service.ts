import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  onSnapshot,
  addDoc,
  Unsubscribe,
  setDoc,
  where,
  query,
  updateDoc,
  orderBy,
  getDocs,
  DocumentReference,
  DocumentData,
  increment,
  serverTimestamp,
  collectionData,
} from '@angular/fire/firestore';
import { User } from '../../../models/user.class';
import { Channel } from '../../../models/channel.class';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ChannelMessage } from '../../../models/channel-message.class';
import { DirectMessage } from '../../../models/direct-message.class';
import { MatchMediaService } from './match-media.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  firestore: Firestore = inject(Firestore);
  router = inject(Router);
  activeUser: any = [];
  user: User = new User();
  channel: Channel = new Channel();
  channelMessage: ChannelMessage = new ChannelMessage();
  userList: any = [];
  channelList: any = [];
  channelMessages: any = [];
  channelThreads: any = [];
  message: DirectMessage = new DirectMessage();
  conversation: string | undefined;
  channelMessagesCount: number = 0;
  matchMedia = inject(MatchMediaService);

  unsubUsers;
  unsubChannel;

  constructor() {
    this.unsubUsers = this.subUserList();
    this.unsubChannel = this.subChannelList();
  }

  getUsersRef() {
    return collection(this.firestore, 'users');
  }

  getChannelsRef() {
    return collection(this.firestore, 'channels');
  }

  getDirectMessageRef() {
    return collection(this.firestore, 'messages');
  }

  async getAllUsers(): Promise<User[]> {
    const usersSnapshot = await getDocs(query(this.getUsersRef(), orderBy('displayName')));
    return usersSnapshot.docs.map(doc => this.setUserObject(doc.data(), doc.id));
  }

  async getAllChannels(): Promise<Channel[]> {
    const channelsSnapshot = await getDocs(query(this.getChannelsRef(), orderBy('name')));
    return channelsSnapshot.docs.map(doc => this.setChannelObject(doc.data(), doc.id));
  }

  async getAllMessages(): Promise<ChannelMessage[]> {
    const messagesSnapshot = await getDocs(query(this.getDirectMessageRef(), orderBy('createdAt')));
    return messagesSnapshot.docs.map(doc => this.setChannelMessageObject(doc.data(), doc.id));
  }

  

  getSingleDocRef(colId: string, docId: string) {
    return doc(collection(this.firestore, colId), docId);
  }

  subUserList() {
    return onSnapshot(
      query(this.getUsersRef(), orderBy('displayName')),
      (list) => {
        this.userList = [];
        list.forEach((element) => {
          this.userList.push(this.setUserObject(element.data(), element.id));
        });
      }
    );
  }

  subChannelList() {
    return onSnapshot(query(this.getChannelsRef(), orderBy('name')), (list) => {
      this.channelList = [];
      list.forEach((element) => {
        this.channelList.push(
          this.setChannelObject(element.data(), element.id)
        );
      });
    });
  }

  setUserObject(obj: any, id: string): any {
    return {
      id: id,
      avatar: obj.avatar,
      email: obj.email,
      displayName: obj.displayName,
      isOnline: obj.isOnline,
      provider: obj.provider,
    };
  }

  setChannelObject(obj: any, id: string): any {
    return {
      creator: obj.creator,
      description: obj.description,
      member: obj.member,
      id: id,
      name: obj.name,
    };
  }

  setChannelMessageObject(obj: any, id: string): any {
    return {
      messageId: id,
      channelId: obj.channelId,
      creator: obj.creator,
      createdAt: obj.createdAt,
      text: obj.text,
      reactions: obj.reactions,
      attachment: obj.attachment,
      threads: obj.threads,
    };
  }

  setMessageObject(obj: any, id: string): any {
    return {
      id: id,
      sender: obj.sender,
      recipient: obj.recipient,
    };
  }

  async updateUser(item: User, id: string) {
    await setDoc(doc(this.getUsersRef(), id), item.toJSON());
  }

  async updateChannel(docId: string, channelData: Channel) {
    if (docId) {
      let docRef = doc(this.getChannelsRef(), docId);
      await updateDoc(docRef, channelData.toJSON()).catch((err) => {
        console.log(err);
      });
    }
  }

  getChannels(): Observable<Channel[]> {
    return new Observable((observer) => {
      const unsubscribe = onSnapshot(
        this.getChannelsRef(),
        (snapshot) => {
          let channels: Channel[] = [];
          snapshot.forEach((doc) =>
            channels.push(this.setChannelObject(doc.data(), doc.id))
          );
          observer.next(channels);
        },
        (err) => observer.error(err)
      );
      return { unsubscribe };
    });
  }

  getUsers2(): Observable<User[]> {
    return new Observable((observer) => {
      const unsubscribe = onSnapshot(
        this.getUsersRef(),
        (snapshot) => {
          let users: User[] = [];
          snapshot.forEach((doc) =>
            users.push(this.setUserObject(doc.data(), doc.id))
          );
          observer.next(users);
        },
        (err) => observer.error(err)
      );
      return { unsubscribe };
    });
  }

  getUsers(): User[] {
    return this.userList;
  }

  getChannel(): Channel[] {
    return this.channelList;
  }

  getSingleUser(): User[] {
    return this.activeUser;
  }

  async addChannel(item: Channel) {
    if (typeof item.creator === 'undefined') {
      console.error('Fehler: Creator ist undefined.');
      return;
    }

    await addDoc(this.getChannelsRef(), item.toJSON())
      .catch((err) => {
        console.error(err);
      })
      .then((docRef) => {
        console.log('Document written with ID: ', docRef?.id);
        this.router.navigate(['/channel/' + docRef?.id]);
      });
  }

  async addChannelMessage(
    message: ChannelMessage,
    docRef: string,
    type?: string
  ) {
    // console.log(message);
    // console.log(docRef);

    await addDoc(collection(this.firestore, docRef), message.toJSON())
      .catch((err) => {
        console.error(err);
      })
      .then(async (docRef) => {
        console.log('Document written with ID: ', docRef?.id);
        this.matchMedia.scrollToBottom = true;
        if (type && type === 'thread') {
          this.matchMedia.scrollToBottomThread = true;
          await this.updateThreadCounter();
        }
      });
  }

  private singleItemUnsubscribe: Unsubscribe | undefined;
  private singleMessageUnsubscribe: Unsubscribe | undefined;

  unsubscribeSingleUserData() {
    if (this.singleItemUnsubscribe) {
      this.singleItemUnsubscribe();
    }
  }

  unsubscribeSingleMessageData() {
    if (this.singleMessageUnsubscribe) {
      this.singleMessageUnsubscribe();
    }
  }

  getSingleItemData(colId: string, docId: string, callback: () => void) {
    let collection = colId === 'channels' ? 'channels' : 'users';

    this.singleItemUnsubscribe = onSnapshot(
      this.getSingleDocRef(collection, docId),
      (element) => {
        if (collection === 'users') {
          this.user = new User(this.setUserObject(element.data(), element.id));
        }
        if (collection === 'channels') {
          this.channel = new Channel(
            this.setChannelObject(element.data(), element.id)
          );
        }

        callback();
      }
    );
  }

  async getAllChannelMessages(
    channelId: string,
    colID: string,
    subcollection: string
  ): Promise<Unsubscribe> {
    const ref = collection(
      this.firestore,
      `${colID}/${channelId}/${subcollection}`
    );
    const querySnapshot = query(ref, orderBy('createdAt'));

    const unsubscribe = onSnapshot(
      querySnapshot,
      (snapshot) => {
        this.channelMessages = [];
        snapshot.forEach((doc) => {
          this.channelMessages.push(
            this.setChannelMessageObject(doc.data(), doc.id)
          );
        });
      },
      (error) => {
        console.error('Error fetching snapshot: ', error);
      }
    );

    return unsubscribe;
  }

  async getAllChannelThreads(
    channelId: string,
    colID: string,
    subcollection: string
  ): Promise<Unsubscribe> {
    const ref = collection(
      this.firestore,
      `${colID}/${channelId}/${subcollection}`
    );
    const querySnapshot = query(ref, orderBy('createdAt'));

    const unsubscribe = onSnapshot(
      querySnapshot,
      (snapshot) => {
        this.channelThreads = [];
        snapshot.forEach((doc) => {
          this.channelThreads.push(
            this.setChannelMessageObject(doc.data(), doc.id)
          );
        });
      },
      (error) => {
        console.error('Error fetching snapshot: ', error);
      }
    );

    return unsubscribe;
  }

  async getDirectMessages(sender: string, recipient: string): Promise<void> {
    try {
      const directMessageRef = this.getDirectMessageRef();

      const query1 = getDocs(
        query(
          directMessageRef,
          where('sender', '==', sender),
          where('recipient', '==', recipient)
        )
      );

      const query2 = getDocs(
        query(
          directMessageRef,
          where('sender', '==', recipient),
          where('recipient', '==', sender)
        )
      );

      const [querySnapshot1, querySnapshot2] = await Promise.all([
        query1,
        query2,
      ]);

      const combinedResults = [...querySnapshot1.docs, ...querySnapshot2.docs];

      combinedResults.forEach((doc) => {
        this.conversation = doc.id;
      });

      if (combinedResults.length === 0) {
        await this.createDirectMessage(sender, recipient);
      }
    } catch (error) {
      console.error('Error getting direct messages:', error);
    }
  }

  async createDirectMessage(sender: string, recipient: string): Promise<void> {
    try {
      const docRef: DocumentReference = await addDoc(
        this.getDirectMessageRef(),
        {
          sender: sender,
          recipient: recipient,
        }
      );
      this.conversation = docRef.id;
    } catch (err) {
      console.error('Error creating direct message:', err);
    }
  }

  ngonDestroyy() {
    this.unsubUsers();
    this.unsubChannel();
  }

  async saveMessageData(
    colId: string,
    docId: string,
    messageId: string,
    item: object
  ) {
    const messageDoc = docId + '/channelmessages/' + messageId;
    const docRef = this.getSingleDocRef(colId, messageDoc);
    await updateDoc(docRef, item).catch((err) => {
      console.log(err);
    });
  }

  async updateThreadCounter() {
    let colID;
    if (this.matchMedia.collectionType === 'messages') {      
      colID = this.getDirectMessageRef();
    } else {
      colID = this.getChannelsRef();
    }

    const threadsRef = doc(
      colID,
      this.matchMedia.channelId + '/channelmessages/' + this.matchMedia.subID
    );

    await updateDoc(threadsRef, {
      threads: increment(1),
      timestampLastThread: serverTimestamp(),
    });
  }

  getChannelData(channelId: string): Observable<DocumentData> {
    const docRef = this.getSingleDocRef('channels', channelId);

    return new Observable<DocumentData>((observer) => {
      const unsubscribe = onSnapshot(docRef, (snapshot) => {
        const data = snapshot.data();
        observer.next(data);
      });

      return () => unsubscribe();
    });
  }

  async getSingleMessageData(
    colId: string,
    docId: string,
    callback: () => void
  ) {
    this.singleMessageUnsubscribe = onSnapshot(
      this.getSingleDocRef(colId, docId),
      (element) => {
        const data = this.setChannelMessageObject(element.data(), element.id);
        this.channelMessage = new ChannelMessage(data);
        callback();
      }
    );
  }

  getAllChannelNames() {
    const ref = this.getChannelsRef();
    return collectionData(query(ref), { idField: 'id' }).pipe(
      map((channels) => channels.map((channel) => channel['name']))
    );
  }
}
