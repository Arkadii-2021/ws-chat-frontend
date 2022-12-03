export const getDataLogin = {};

export function userLogin(el, server) {
  const container = document.createElement('div');
  container.classList.add('chat_login');
    
  const chatLoginForm = document.createElement('form');
  chatLoginForm.classList.add('chat_login_form');
    
  const nickNameTitle = document.createElement('h3');
  nickNameTitle.textContent = 'Введите никнейм';
    
  const chatLoginContainer = document.createElement('div');
  chatLoginContainer.classList.add('chat_login_container');
    
  const chatLoginInput = document.createElement('input');
  chatLoginInput.setAttribute('name', 'login');
  chatLoginInput.classList.add('chat_login_input');
    
  const btn = document.createElement('button');
  btn.textContent = 'Войти';
    
  el.append(container);
  container.append(chatLoginForm);
  chatLoginForm.append(nickNameTitle, chatLoginContainer, btn);
  chatLoginContainer.append(chatLoginInput);

  const form = el.querySelector('.chat_login_form');
  const nickElement = el.querySelector('.chat_login_input');
  getDataLogin['nickEl'] = nickElement;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (el.value === '') {
      showError({ reason: 'Введите логин' }, el);
      return;
    }

    getDataLogin['ws'] = new WebSocket(server);

    getDataLogin['ws'].addEventListener('open', () => {
      getDataLogin['ws'].send(JSON.stringify({event: 'login', message: nickElement.value}));
    });

    getDataLogin['ws'].addEventListener('message', (evt) => {
      const msg = JSON.parse(evt.data);
      if (msg.event === 'connect') {
        const clientsList = msg.message;
        getDataLogin['clientLst'] = clientsList;
        el.dispatchEvent(new Event('connect'));
      } else if (msg.event === 'inchat') {
        showError({ reason: 'Такой никнейм уже есть в чате' }, el);
      }
    });

    if (chatLoginInput.value === '') {
      showError({ reason: 'Никнейм не должен быть пустым!' }, el);
    } else if (chatLoginInput.value.length > 16) {
      showError({ reason: 'Никнейм не должен превышать 16 символов!' }, el);
    }

    getDataLogin['ws'].addEventListener('error', (evt) => {
      console.error(evt);
    });      
  });
}

function showError(evt, el) {
  const error = document.createElement('div');
  error.classList.add('chat_login_error');
  error.innerText = evt.reason;
  el.querySelector('.chat_login_container').append(error);
  getDataLogin['nickEl'].addEventListener('focus', () => {
    getDataLogin['nickEl'].value = '';
    const error = el.querySelector('.chat_login_error');
    if (error) {
      error.remove();
    }      
  });
}
