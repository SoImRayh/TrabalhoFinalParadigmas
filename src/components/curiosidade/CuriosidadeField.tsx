import {Simulate} from "react-dom/test-utils";
import dragOver = Simulate.dragOver;
import {ResponseInterface} from "../../domain/ResponseInterface";



export function CuriosidadeField(props: ResponseInterface){
  return (
    <div>
      <h1>{props.data}</h1>
    </div>
  );
}
