import { Injectable, inject } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private socket: Socket | null = null;
  private eventSubject = new Subject<{ eventName: string; data: any }>();

  public readonly events$ = this.eventSubject.asObservable();

  constructor() {
    this.connect();
  }

  private connect(): void {
    if (environment.useLocalStorage) {
      console.warn('Режим LocalStorage: подключение к WebSocket пропущено.');
      return;
    }

    try {
      this.socket = io('http://localhost:3000/events', {
        transports: ['websocket', 'polling'],
        reconnectionAttempts: 5,
        reconnectionDelay: 2000,
      });

      this.socket.on('connect', () => {
        console.log('Успешное подключение к WebSocket (Socket.io)');
      });

      this.socket.on('connect_error', (error) => {
        console.error('Ошибка подключения к WebSocket:', error);
      });

      this.socket.on('comment-created', (data) => {
        this.eventSubject.next({ eventName: 'comment-created', data });
      });

      this.socket.on('comment-rating-changed', (data) => {
        this.eventSubject.next({ eventName: 'comment-rating-changed', data });
      });

      this.socket.on('article-rating-changed', (data) => {
        this.eventSubject.next({ eventName: 'article-rating-changed', data });
      });
    } catch (err) {
      console.error('Не удалось инициализировать WebSocket:', err);
    }
  }

  public subscribeToArticle(articleId: string): void {
    if (this.socket) {
      this.socket.emit('subscribe-article', articleId);
    }
  }

  public unsubscribeFromArticle(articleId: string): void {
    if (this.socket) {
      this.socket.emit('unsubscribe-article', articleId);
    }
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
