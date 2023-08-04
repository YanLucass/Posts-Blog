// carregamento dos posts na home

const url = "https://jsonplaceholder.typicode.com/posts"

const loadingElement = document.querySelector("#loading"); //  pega o parafro loadin
const postsContainer = document.querySelector("#posts-container") // capturar div para inserir os posts
const postPage = document.querySelector('#post') // div principal
const postContainer = document.querySelector('#post-container');   // div do post

const commentsContainer = document.querySelector('#comments-container'); // comentários
const commentForm = document.querySelector('#comment-form'); // formulario
const emailInput = document.querySelector('#email');
const bodyArea = document.querySelector('#body')


//Get id from url

const urlSearchParams = new URLSearchParams(window.location.search) // Entrega objeto q podemos acessar os parametros q tá na minha url com metood get
console.log(urlSearchParams)
const postId = urlSearchParams.get("id")

// GET ALL POSTS = FUNÇÃO QUE PEGA TODOS OS POSTS

async function getAllPosts() {
    try {
    const response = await fetch(url) // esperando a resposta response convenção para primeira resposta retornada pela fetch
    const data = await response.json() 
    //console.log(data);

    // esconder loadingElement depois de receber os dados.

    loadingElement.classList.add("hide");

    // inserir dados na div

    data.map(post => {
        const div = document.createElement('div');
        const title = document.createElement('h2');
        const body = document.createElement('p'); // corpo do post
        const link = document.createElement('a');

        // preencher os conteudos com os dados da api
        title.classList.add("title")
        title.innerText = post.title;
        
        body.innerText = post.body;
        link.innerText = "ler" // texto do botao
        link.setAttribute("href", `/post.html?id=${post.id}`); // colocamos na url o id do post para conseguirmos ter a pagina de post individual
        // mandando id para proxima pagina para resgartar ele com js e carregar os dados do post

        div.appendChild(title);
        div.appendChild(body);
        div.appendChild(link);
        div.classList.add('divPost')

        postsContainer.appendChild(div)
     })
    }  catch(e) {
        alert('Não conseguimos dados.')
 }
}

// GET INDIVIDUAL POST FUNÇÃO QUE PEGA OS POSTS INDIVIDUAIS

async function getPost(id) {
    try {
    //Executar dois requests assicronos ao msm tempo com fetch
    const [responsePost, responseComments] = await Promise.all([
        fetch(`${url}/${id}`), // dados do post individual
        fetch(`${url}/${id}/comments`)
    ])
 
     // teremos  dois array de objeots agora
    const dataPost = await responsePost.json(); 
    console.log(dataPost)
    const dataComments = await responseComments.json();
    

    //  carregar post
    loadingElement.classList.add("hide"); // remover carregando
    postPage.classList.remove("hide"); // aparecer a div principal onde tá o html de posts, coments etc.
    
    const title = document.createElement("h1");
    title.classList.add('title');
    const body = document.createElement("p");
    body.classList.add('postIndividual')
    title.innerText = dataPost.title;
    body.innerHTML = dataPost.body; // corpo do comentário

    postContainer.appendChild(title);
    postContainer.appendChild(body);
    console.log(dataComments)

    // carregar comentários

    dataComments.map(comment => {
        createComment(comment); // passa cada comentário individual como argumento para comment

    });
} catch(e) {
    alert('Não conseguimos os dados')
}
}  

 // Função recebe um objeto comentário e cria elementos para exibir
function createComment(comment) {

    const div = document.createElement('div');
    const email = document.createElement('h3');
    const commentBody = document.createElement('p');

    email.innerText = comment.email;
    email.classList.add('email');
    commentBody.innerHTML = comment.body;

    div.appendChild(email);
    div.appendChild(commentBody);
    div.classList.add('comment')
    commentsContainer.appendChild(div) // coloca div pronta com comentários na div de comentários 
}

 // Função Post a comment 

async function postComment(comment) {

    // Uso do post
    try {
    const response = await fetch(`${url}/${postId}/comments`, { // vamos dar um post nessa url
        method: "POST",
        body: comment,
        headers: {
            "Content-type": "application/json", // padrozinar trafego de dados
        }     
    })
    
    const data = await response.json();
    console.log(data); // Nessa API retorna o que estamos enviando em json, no caso enviamos uma string em formado de json + um id
   
    createComment(data)
} catch(e) {
    alert('Erro ao adicionar os comentários.')
}
}

if(!postId) {
    getAllPosts();
} 

else {
    getPost(postId)


    //adcionar evento de comentar formulario

    commentForm.addEventListener("submit", e => {
        e.preventDefault();


        let comment = {
            email: emailInput.value,
            body: bodyArea.value
        };

        if (!isValidEmail(emailInput.value)) {
            alert('E-mail inválido. Por favor, insira um e-mail válido.');
            return;
        }

        console.log(comment)
        comment = JSON.stringify(comment) // retorna texto em formato de json valido 

        postComment(comment) // responsável pela requisição assicrona q vai inserir o comentário no sistema
    })
}

function isValidEmail(email) {
    // Expressão regular para validar o formato do e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}