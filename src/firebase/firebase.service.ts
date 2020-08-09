import { Injectable } from "@angular/core";
import { AngularFirestore, CollectionReference, DocumentData, DocumentReference } from '@angular/fire/firestore';

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

    protected edit<T>(item: T, docIdentifier?: string): Promise<void> {
        return this.firestore.firestore.collection(this.collection).doc(docIdentifier).set(item);
    }

    protected put<T>(item: T): Promise<DocumentReference> {
        return this.firestore.firestore.collection(this.collection).add(item)
            .then(item => item.get().then(itemData => item.set({...itemData.data(), id: item.id})).then(() => item));
    }

    protected delete() { }
}