(() => {
  'use strict';

  // Função para obter o tema armazenado localmente
  const getStoredTheme = () => localStorage.getItem('theme');

  // Função para definir o tema armazenado localmente
  const setStoredTheme = theme => localStorage.setItem('theme', theme);

  // Função para obter o tema preferido com base nas configurações do navegador
  const getPreferredTheme = () => {
    const storedTheme = getStoredTheme();
    if (storedTheme) {
      return storedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  // Função para aplicar o tema atual
  const setTheme = theme => {
    // Definir o tema na raiz do documento
    document.documentElement.setAttribute('data-bs-theme', theme);
  };


  // Função para exibir o tema ativo no seletor visual
  const showActiveTheme = (theme, focus = false) => {
    const themeSwitcher = document.querySelector('#bd-theme');

    if (!themeSwitcher) {
      return;
    }

    const themeSwitcherText = document.querySelector('#bd-theme-text');
    const activeThemeIcon = document.querySelector('.theme-icon-active use');
    const btnToActive = document.querySelector(`[data-bs-theme-value="${theme}"]`);
    const svgOfActiveBtn = btnToActive.querySelector('svg use').getAttribute('href');

    document.querySelectorAll('[data-bs-theme-value]').forEach(element => {
      element.classList.remove('active');
      element.setAttribute('aria-pressed', 'false');
    });

    btnToActive.classList.add('active');
    btnToActive.setAttribute('aria-pressed', 'true');
    activeThemeIcon.setAttribute('href', svgOfActiveBtn);
    const themeSwitcherLabel = `${themeSwitcherText.textContent} (${btnToActive.dataset.bsThemeValue})`;
    themeSwitcher.setAttribute('aria-label', themeSwitcherLabel);

    if (focus) {
      themeSwitcher.focus();
    }
  };

  // Evento para detectar mudanças no esquema de cores do sistema operacional
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const storedTheme = getStoredTheme();
    if (storedTheme !== 'light' && storedTheme !== 'dark') {
      setTheme(getPreferredTheme());
    }
  });

  // Evento quando o DOM é carregado
  window.addEventListener('DOMContentLoaded', () => {
    // Definir o tema inicialmente
    setTheme(getPreferredTheme());
    // Exibir o tema ativo
    showActiveTheme(getPreferredTheme());

    // Evento para alternar o tema ao clicar nos botões de seleção de tema
    document.querySelectorAll('[data-bs-theme-value]').forEach(toggle => {
      toggle.addEventListener('click', () => {
        const theme = toggle.getAttribute('data-bs-theme-value');
        setStoredTheme(theme); // Armazenar o tema selecionado localmente
        setTheme(theme); // Aplicar o tema selecionado
        showActiveTheme(theme, true); // Exibir o tema ativo visualmente
      });
    });
  });

})();
