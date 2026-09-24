# Eleve Makers — site institucional

Site estático (HTML, CSS e JS puros) da Eleve Makers: IA e resultado para escritórios de arquitetura e todo o ecossistema da construção.

Referência visual e estrutural: [pareto.io](https://pareto.io/) (tema claro, display serifada, seção escura de soluções, marcas de registro em cruz e grade de blueprint, marquee de cases, acordeões e abas).

## Estrutura

```
index.html            página única (hero, diagnóstico em passos, segmentos e projetos,
                      valor + stats, problema, método, soluções, cases, stack, FAQ,
                      contato com o formulário em passos, footer)
assets/css/style.css  sistema visual (tokens no topo do arquivo)
assets/js/main.js     rotator do título, navegação, acordeões, abas, contadores,
                      formulário e WhatsApp (bloco CONFIG no topo do arquivo)
assets/img/logo.svg   logotipo
favicon.svg
```

## Antes de publicar

1. **WhatsApp**: em `assets/js/main.js`, troque `CONFIG.whatsapp` pelo número comercial (55 + DDD + número, só dígitos).
2. **Formulário em passos** (`#diagnostico`, repetido em `#contato`): preencha `CONFIG.formEndpoint` com um webhook (CRM, Make, n8n, Formspree) que receba um POST JSON com os campos `contatos, segmento, frentes, gargalo, faturamento, nome, empresa, email, telefone, observacoes, origem, enviado_em`. Sem endpoint, o formulário abre o WhatsApp com o resumo do lead. Todos os CTAs da página apontam para `#diagnostico`.
3. **Cases**: a seção `#cases` traz Parket, Travertino Navona, Studio Meraki e Quadra Engenharia. Confirme a descrição das frentes entregues em cada card (`.case-front`). Os números da caixa de stats em `#valor` são posicionamento, não métricas de cliente.
4. **Redes sociais**: ajuste os links de Instagram e LinkedIn no rodapé.
5. **Palavras do título**: edite `CONFIG.rotatorWords`.

## Rodar localmente

```
python3 -m http.server 8080
# abra http://localhost:8080
```

## Publicar

Qualquer hospedagem estática serve (Vercel, Netlify, Cloudflare Pages, GitHub Pages, cPanel). Aponte o domínio `elevemakers.com` para a pasta raiz.
