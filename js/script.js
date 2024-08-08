document.querySelector('.burger').addEventListener('click', () => {
  document.querySelector('nav').classList.toggle('open');
  document.querySelector('.burger').classList.toggle('open');
  document.querySelector('body').classList.toggle('unscrollable');
})

document.body.addEventListener('scroll', () => {
  let scroll = document.body.scrollTop;
  if (scroll > 50) {
    if (window.matchMedia("(max-width: 500px)").matches) {
      document.getElementById('title').style.height = "35px";
      document.querySelector('#title h1').style.fontSize = "20px";
    } else {
      document.getElementById('title').style.height = "40px";
      document.querySelector('#title h1').style.fontSize = "25px";
    }
    document.querySelector('.burger').style.marginLeft = "10px"
    document.querySelector('.burger').style.marginTop = "3px"
  } else {
    if (window.matchMedia("(max-width: 500px)").matches) {
      document.getElementById('title').style.height = "55px";
      document.querySelector('#title h1').style.fontSize = "35px";
    } else {
      document.getElementById('title').style.height = "65px";
      document.querySelector('#title h1').style.fontSize = "40px";
    }
    document.querySelector('.burger').style.marginLeft = "20px"
    document.querySelector('.burger').style.marginTop = "0"
  }
})