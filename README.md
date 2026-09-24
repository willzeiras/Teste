# Eleve Makers — site institucional

Site estático (HTML, CSS e JS puros) da Eleve Makers: IA e resultado para escritórios de arquitetura e todo o ecossistema da construção.

Referência visual e estrutural: [pareto.io](https://pareto.io/) (tema claro, display serifada, seção escura de soluções, marcas de registro em cruz e grade de blueprint, marquee de cases, acordeões e abas).

## Estrutura

```
index.html            página única (hero, segmentos, valor + stats, problema, método,
                      soluções, cases, stack, FAQ, diagnóstico/formulário, footer)
assets/css/style.css  sistema visual (tokens no topo do arquivo)
assets/js/main.js     rotator do título, navegação, acordeões, abas, contadores,
                      formulário e WhatsApp (bloco CONFIG no topo do arquivo)
assets/img/logo.svg   logotipo
favicon.svg
```

## Antes de publicar

1. **WhatsApp**: em `assets/js/main.js`, troque `CONFIG.whatsapp` pelo número comercial (55 + DDD + número, só dígitos).
2. **Formulário**: preencha `CONFIG.formEndpoint` com um webhook (CRM, Make, n8n, Formspree). Sem endpoint, o formulário abre o WhatsApp com o resumo do lead.
3. **Números de cases e stats**: os valores nas seções `#valor` e `#cases` são ilustrativos. Substitua pelos resultados reais antes de ir ao ar (os blocos estão marcados com `SUBSTITUA` no HTML).
4. **Redes sociais**: ajuste os links de Instagram e LinkedIn no rodapé.
5. **Palavras do título**: edite `CONFIG.rotatorWords`.

## Rodar localmente

```
python3 -m http.server 8080
# abra http://localhost:8080
```

## Publicar

Qualquer hospedagem estática serve (Vercel, Netlify, Cloudflare Pages, GitHub Pages, cPanel). Aponte o domínio `elevemakers.com` para a pasta raiz.
