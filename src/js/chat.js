import { userLogin, getDataLogin } from './loginChat';

export default function init(el, server) {
  const chatElement = el.querySelector('.chat_messages');
  const login = userLogin(el, server);

  el.addEventListener('connect', () => {
    const nickname = getDataLogin.nickEl.value;
    const allClients = getDataLogin.clientLst;
    chatUsersReload(getDataLogin.clientLst, el);
    document.querySelector('.chat_login').remove();
    
    getDataLogin['ws'].addEventListener('message', (evt) => {
      const msg = JSON.parse(evt.data);
      if (msg.event === 'chat' && msg.message.text.length > 0) {
        const msgElement = messageConstructor(
          nickname, msg.message.nickname, msg.message.text,
        );
        chatElement.append(msgElement);
        chatElement.scrollTop = chatElement.scrollHeight
        - chatElement.getBoundingClientRect().height;
      }

    if (msg.event === 'system') {
    const msgElement = document.createElement('div');
    msgElement.classList.add('chat_system_message');
    
    if (msg.message.action === 'login') {
      msgElement.innerText = `${msg.message.nickname} присоединился к чату`;
      if (nickname !== msg.message.nickname) allClients.push(msg.message.nickname);
    } else if (msg.message.action === 'logout') {
      msgElement.innerText = `${msg.message.nickname} покинул чат`;
      const clientIndex = allClients.indexOf(msg.message.nickname);
      allClients.splice(clientIndex, 1);
    }
    chatElement.append(msgElement);
    chatElement.scrollTop = chatElement.scrollHeight
    - chatElement.getBoundingClientRect().height;
    chatUsersReload(allClients, el);
    }
  });

    el.querySelector('.chat_form').addEventListener('submit', (e) => {
      e.preventDefault();
      const message = JSON.stringify({event: 'chat', message: el.querySelector('.chat_input').value});
      getDataLogin['ws'].send(message);
      el.querySelector('.chat_input').value = '';
    });  
  });  
}

function getDateTime() {
	let timestamp = new Date();
  
  const getData = {
    'date': timestamp.getDate().toString().length < 2 
            ? timestamp.getDate().toString().padStart(2, '0') 
            : timestamp.getDate(),
    'month': timestamp.getMonth().toString().length < 2
            ? timestamp.getMonth().toString().padStart(2, '0') 
            : timestamp.getMonth(),
    'year': timestamp.getFullYear(),
	  'hours': timestamp.getHours().toString().length < 2
            ? timestamp.getHours().toString().padStart(2, '0') 
            : timestamp.getHours(),
	  'minutes': timestamp.getMinutes().toString().length < 2
            ? timestamp.getMinutes().toString().padStart(2, '0') 
            : timestamp.getMinutes(),
  };

  return `${getData.hours}:${getData.minutes} ${getData.date}.${getData.month + 1}.${getData.year}`;
};

function messageConstructor(nicknameVal, nickname, text) {
    const msgElement = document.createElement('div');
    msgElement.classList.add('chat_message');
    if (nicknameVal === nickname) {
      msgElement.classList.add('chat_message_you');
    }
    const userHeader = document.createElement('div');
    userHeader.classList.add('chat_message_container');
    const msgNickname = document.createElement('div');
    msgNickname.classList.add('chat_message_nickname');
    msgNickname.innerText = nickname;
    const userDate = document.createElement('time');
    userDate.classList.add('chat_message_date');
    userDate.innerText = getDateTime();
    const userText = document.createElement('div');
    userText.classList.add('chat_message_text');
    userText.innerText = text;
    userHeader.append(msgNickname, userDate);
    msgElement.append(userHeader, userText);
    return msgElement;
}

function chatUsersReload(allClients, el) {
  const chatUsersElement = el.querySelector('.chat_users_list');
  chatUsersElement.innerHTML = '';
  allClients.forEach((client) => {
    const clientElement = document.createElement('li');
    clientElement.classList.add('chat_user');
    clientElement.innerText = client;
    chatUsersElement.append(clientElement);
  });
  const clientElement = document.createElement('li');
  clientElement.classList.add('chat_user');
  clientElement.classList.add('chat_user_you');
  clientElement.innerText = allClients.length ? 'Я' : 'Никого нет...';
  chatUsersElement.append(clientElement);
}
