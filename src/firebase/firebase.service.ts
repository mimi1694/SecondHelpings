import { Injectable } from "@angular/core";
import { AngularFirestore, CollectionReference, DocumentData } from '@angular/fire/firestore';

@Injectable({ providedIn: "root" })
export class FirebaseService {

    constructor(private firestore: AngularFirestore, private readonly collection: string) {
        this.onInit();
    }

    protected onInit(): void {}

    protected getCollectionSnap(): CollectionReference {
        return this.firestore.firestore.collection(this.collection);
    }

    protected getDocInCollection(doc: string): Promise<DocumentData> {
        return this.firestore.firestore.collection(this.collection).doc(doc).get();
    }

    protected put<T>(docIdentifier: string, item: T): Promise<void> {
        return this.firestore.firestore.collection(this.collection).doc(docIdentifier).set(item);
    }

    protected edit() { }

    protected delete() { }
}