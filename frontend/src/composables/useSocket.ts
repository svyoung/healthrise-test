import { ref } from 'vue';

export function useSocket() {
  const messages = ref<any[]>([]);
  let socket: any;

  const connect = () => {
    socket = new WebSocket('ws://localhost:4000');
    socket.onmessage = (evt: MessageEvent) => {
  messages.value.push(JSON.parse(evt.data));
    };
  };

  return { connect, messages };
}
