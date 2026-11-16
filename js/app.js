/* =====================================================
   CONFIGURAÇÃO — troque aqui o link do seu Google Forms.
   Use o endereço terminado em /viewform e mantenha ?embedded=true
   ===================================================== */
var FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSd8FKa2EaVTD9Ph7bLx2oxsG7Q1Nt9nAIBYLPjO-b8CSVR2mQ/viewform';

/* ---------- utilidades ---------- */
function $(id){return document.getElementById(id)}
var emailOk=function(v){return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)};

/* ---------- sessão simulada (sem backend) ---------- */
var user=null;
try{user=JSON.parse(sessionStorage.getItem('cb_user')||'null')}catch(e){}
function setUser(u){user=u;try{u?sessionStorage.setItem('cb_user',JSON.stringify(u)):sessionStorage.removeItem('cb_user')}catch(e){}}

/* ---------- fluxo de 5 etapas (dados da seção Integração) ---------- */
var etapas=[
 ['BuildControl','Planejamento','Cadastro da obra, cronograma e teto de orçamento.'],
 ['BuildConnect','Cotação','Requisição de materiais e cotação com fornecedores.'],
 ['BuildConnect','Execução','Recebimento, conferência e medição dos serviços.'],
 ['BuildControl','Financeiro','Notas fiscais, retenções e caixa orçado × realizado.'],
 ['BuildControl','Encerramento','Dossiê fiscal, CND e relatório para o Imposto de Renda.']];
$('flow').innerHTML=etapas.map(function(e,i){
 return '<li><div class="n" aria-hidden="true">'+(i+1)+'</div><span class="mod">'+e[0]+'</span><h3>'+e[1]+'</h3><p>'+e[2]+'</p></li>'}).join('');

/* ---------- roteador por hash ---------- */
var telas=['inicio','pesquisa','login','dashboard','connect','control'];
var titulos={inicio:'ConnectBuild — Conecte sua obra. Controle seu dinheiro.',pesquisa:'Pesquisa de Satisfação — ConnectBuild',login:'Login — ConnectBuild',dashboard:'Painel — ConnectBuild',connect:'BuildConnect — ConnectBuild',control:'BuildControl — ConnectBuild'};
function go(r){
 if(telas.indexOf(r)<0)r='inicio';
 if(['dashboard','connect','control'].indexOf(r)>=0&&!user)r='login'; // páginas protegidas
 telas.forEach(function(t){$('v-'+t).classList.toggle('show',t===r)});
 document.title=titulos[r];
 // carrega o iframe só quando a tela de pesquisa é aberta (desempenho)
 if(r==='pesquisa'&&!$('formFrame').getAttribute('src')){$('formFrame').src=FORM_URL+'?embedded=true';$('formLink').href=FORM_URL}
 var l=$('loginLink');l.textContent=user?'Meu painel':'Login';l.dataset.go=user?'dashboard':'login';l.href=user?'#dashboard':'#login';
 $('uname').textContent=user?user.name:'usuário';
 if(location.hash!=='#'+r)history.replaceState(null,'','#'+r);
 window.scrollTo(0,0);$('conteudo').focus({preventScroll:true});
}
document.addEventListener('click',function(e){
 var a=e.target.closest('[data-go],[data-sec],#logout');if(!a)return;
 if(a.id==='logout'){e.preventDefault();setUser(null);go('inicio');return}
 e.preventDefault();
 if(a.dataset.go)go(a.dataset.go);
 if(a.dataset.sec){go('inicio');setTimeout(function(){$(a.dataset.sec).scrollIntoView()},30)}
});
window.addEventListener('hashchange',function(){go(location.hash.slice(1))});

/* ---------- login simulado ---------- */
$('fLogin').addEventListener('submit',function(e){
 e.preventDefault();var em=$('le').value.trim(),pw=$('lp').value,m=$('lMsg');
 if(!emailOk(em)||pw.length<4){m.className='msg err';m.textContent='Informe um e-mail válido e senha com 4+ caracteres.';return}
 var n=em.split('@')[0];setUser({name:n.charAt(0).toUpperCase()+n.slice(1)});go('dashboard');
});

go(location.hash.slice(1)||'inicio');
