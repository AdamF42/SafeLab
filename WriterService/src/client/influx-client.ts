import  HttpClient  from './http-client';
import { User } from './types';

class MainApi extends HttpClient {
  
  public constructor(url:string) {
    super(url);
  }

  public getUsers = () => this.instance.get<User[]>('/users');
  
  public getUser = (id: string) => this.instance.get<User>(`/users/${id}`);
}