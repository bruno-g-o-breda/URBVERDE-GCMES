// URBVERDE-GCMES/src/utils/tawkTo.js
/* Este módulo injeta dinamicamente o script de chat do Tawk.to no DOM.*/
export function initTawkTo() {
  // Evita múltiplas injeções do mesmo script
  if (document.getElementById('tawkto-script')) {
    return;
  }

  const s1 = document.createElement('script');
  const s0 = document.getElementsByTagName('script')[0];
  s1.id = 'tawkto-script'; // Adiciona um ID para checagem futura
  s1.async = true;
  s1.src = 'https://embed.tawk.to/665004409a809f19fb344c19/1huk917ia';
  s1.charset = 'UTF-8';
  s1.setAttribute('crossorigin', '*');
  if (s0 && s0.parentNode) {
    s0.parentNode.insertBefore(s1, s0);
  } else {
    // Fallback caso não encontre nenhum script (raro)
    document.head.appendChild(s1);
  }
}
