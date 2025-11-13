const state = {
  stories: [],
  posts: [],
  threads: [],
  activeThread: null
};

const qs = (selector, scope = document) => scope.querySelector(selector);
const qsa = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

function initData() {
  state.stories = [
    { id: "story-me", name: "Votre story", image: "https://images.unsplash.com/photo-1472457897821-70d3819a0e24?auto=format&fit=crop&w=200&q=60", isOwn: true },
    { id: "story-1", name: "Sora", image: "https://images.unsplash.com/photo-1533777419517-3e4017e2e15b?auto=format&fit=crop&w=200&q=60" },
    { id: "story-2", name: "Koji", image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=200&q=60" },
    { id: "story-3", name: "Vert&Frais", image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=200&q=60" },
    { id: "story-4", name: "Lalande", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=200&q=60" },
    { id: "story-5", name: "Brume", image: "https://images.unsplash.com/photo-1481833761820-0509d3217039?auto=format&fit=crop&w=200&q=60" }
  ];

  state.posts = [
    {
      id: "post-1",
      author: { name: "Maison Sora", username: "@maisonsora", avatar: "https://images.unsplash.com/photo-1525771821676-1e35a05e710d?auto=format&fit=crop&w=200&q=60" },
      image: "https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=900&q=60",
      liked: false,
      likes: 1860,
      caption: "Nouvelle sequence autour des textures soufflees et agrumes rotis.",
      commentsCount: 243,
      time: "il y a 2 h"
    },
    {
      id: "post-2",
      author: { name: "Camille Lalande", username: "@camille.food", avatar: "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=200&q=60" },
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=60",
      liked: true,
      likes: 941,
      caption: "City guide Tokyo - 3 maisons a tester avant 18h.",
      commentsCount: 102,
      time: "il y a 5 h"
    },
    {
      id: "post-3",
      author: { name: "Koji Bar", username: "@kojibar", avatar: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=200&q=60" },
      image: "https://images.unsplash.com/photo-1527169402691-feff5539e52c?auto=format&fit=crop&w=900&q=60",
      liked: false,
      likes: 128,
      caption: "Live mixology neon ce soir 21h.",
      commentsCount: 12,
      time: "hier"
    }
  ];

  state.threads = [
    {
      id: "thread-1",
      name: "Crew Food Explorers",
      last: "On bloque la table pour vendredi ?",
      messages: [
        { id: "msg-1", author: "Camille", text: "On teste la table neon ?", time: "18:21", me: true },
        { id: "msg-2", author: "Koji", text: "Je reserve pour 20h.", time: "18:24", me: false },
        { id: "msg-3", author: "Sora", text: "J apporte la carte pairing.", time: "18:30", me: false }
      ]
    },
    {
      id: "thread-2",
      name: "Maison Sora",
      last: "Report analytics dispo",
      messages: [
        { id: "msg-4", author: "Sora", text: "Les stats sont live.", time: "11:03", me: false },
        { id: "msg-5", author: "Camille", text: "Merci, j en fais un highlight.", time: "11:05", me: true }
      ]
    }
  ];

  state.activeThread = state.threads[0]?.id ?? null;
}

function renderStories() {
  const strip = qs("#storiesStrip");
  if (!strip) return;
  strip.innerHTML = state.stories.map(story => `
    <article class="story" data-story="${story.id}">
      <div class="story__avatar ${story.isOwn ? "story__avatar--own" : ""}">
        <img src="${story.image}" alt="Story de ${story.name}">
      </div>
      <span class="story__name">${story.name}</span>
    </article>
  `).join("");
}

function formatLikes(count) {
  return count >= 1000 ? `${(count / 1000).toFixed(1)}k` : count;
}

function renderPosts() {
  const feed = qs("#feed");
  if (!feed) return;
  feed.innerHTML = state.posts.map(post => `
    <article class="post" data-id="${post.id}">
      <header>
        <div class="avatar">
          <img src="${post.author.avatar}" alt="${post.author.name}">
        </div>
        <div>
          <h2>${post.author.name}</h2>
          <span>${post.author.username}  ${post.time}</span>
        </div>
      </header>
      <div class="post__image">
        <img src="${post.image}" alt="Publication de ${post.author.name}">
      </div>
      <div class="post__actions">
        <div class="post__actions-left">
          <button data-action="like" aria-label="Aimer"></button>
          <button data-action="comment" aria-label="Commenter"></button>
          <button data-action="share" aria-label="Partager"></button>
        </div>
        <button data-action="save" aria-label="Enregistrer"></button>
      </div>
      <div class="post__stats">${formatLikes(post.likes)} J aime</div>
      <div class="post__caption"><span>${post.author.username}</span> <p>${post.caption}</p></div>
      <div class="post__comments">Voir les ${post.commentsCount} commentaires</div>
    </article>
  `).join("");
}

function renderThreads() {
  const list = qs("#threadList");
  if (!list) return;
  list.innerHTML = state.threads.map(thread => `
    <article class="thread ${thread.id === state.activeThread ? "is-active" : ""}" data-thread="${thread.id}">
      <strong>${thread.name}</strong>
      <span>${thread.last}</span>
    </article>
  `).join("");
}

function renderConversation() {
  const thread = state.threads.find(item => item.id === state.activeThread);
  if (!thread) return;
  const header = qs("#conversationHeader");
  const messages = qs("#conversationMessages");
  if (!header || !messages) return;

  header.textContent = thread.name;
  messages.innerHTML = thread.messages.map(message => `
    <div class="bubble ${message.me ? "bubble--me" : ""}" data-id="${message.id}">
      <span>${message.text}</span>
      <small>${message.time}</small>
    </div>
  `).join("");
  messages.scrollTop = messages.scrollHeight;
}

function toggleModal(name, open) {
  const overlay = qs(`[data-modal="${name}"]`);
  if (!overlay) return;
  overlay.classList.toggle("is-open", open);
  overlay.setAttribute("aria-hidden", (!open).toString());
  if (open) {
    overlay.focus?.();
  }
}

function toggleLike(id) {
  const post = state.posts.find(item => item.id === id);
  if (!post) return;
  post.liked = !post.liked;
  post.likes += post.liked ? 1 : -1;
  renderPosts();
}

function handleNav(target) {
  qsa(".nav__btn").forEach(btn => {
    btn.classList.toggle("is-active", btn.dataset.tab === target);
  });
}

function handleEvents() {
  qs("[data-action='open-messages']")?.addEventListener("click", () => toggleModal("inbox", true));
  qs("[data-action='open-notifications']")?.addEventListener("click", () => alert("Notifications a venir"));

  qsa("[data-action='create']").forEach(btn => {
    btn.addEventListener("click", () => toggleModal("post", true));
  });

  qsa("[data-action='close']").forEach(btn => {
    btn.addEventListener("click", () => {
      const modal = btn.closest(".overlay");
      if (!modal) return;
      toggleModal(modal.dataset.modal, false);
    });
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      qsa(".overlay.is-open").forEach(modal => toggleModal(modal.dataset.modal, false));
    }
  });

  qs("#feed")?.addEventListener("click", event => {
    const button = event.target.closest("button");
    if (!button) return;
    const post = event.target.closest(".post");
    if (!post) return;
    const { action } = button.dataset;
    if (action === "like") toggleLike(post.dataset.id);
    if (action === "comment") alert("TODO: ouvrir les commentaires");
    if (action === "share") alert("TODO: partage" );
    if (action === "save") alert("Enregistr !");
  });

  qs("#threadList")?.addEventListener("click", event => {
    const item = event.target.closest(".thread");
    if (!item) return;
    state.activeThread = item.dataset.thread;
    renderThreads();
    renderConversation();
  });

  qs("#conversationForm")?.addEventListener("submit", event => {
    event.preventDefault();
    const input = event.target.message;
    const text = input.value.trim();
    if (!text) return;
    const thread = state.threads.find(item => item.id === state.activeThread);
    if (!thread) return;
    const message = {
      id: `msg-${Date.now()}`,
      author: "Vous",
      text,
      time: "maintenant",
      me: true
    };
    thread.messages.push(message);
    thread.last = text;
    input.value = "";
    renderThreads();
    renderConversation();
  });

  qsa(".nav__btn").forEach(btn => {
    btn.addEventListener("click", () => handleNav(btn.dataset.tab));
  });

  const composerForm = qs("#composerForm");
  composerForm?.addEventListener("input", () => {
    const caption = composerForm.caption.value.trim();
    qs("[data-action='publish']")?.toggleAttribute("disabled", caption.length === 0);
  });

  qs("[data-action='publish']")?.addEventListener("click", () => {
    const form = qs("#composerForm");
    const caption = form.caption.value.trim();
    if (!caption) return;
    const newPost = {
      id: `post-${Date.now()}`,
      author: {
        name: "Vous",
        username: "@vous",
        avatar: state.stories[0]?.image ?? "https://images.unsplash.com/photo-1472457897821-70d3819a0e24?auto=format&fit=crop&w=200&q=60"
      },
      image: state.stories[0]?.image ?? "https://images.unsplash.com/photo-1472457897821-70d3819a0e24?auto=format&fit=crop&w=900&q=60",
      liked: false,
      likes: 0,
      caption,
      commentsCount: 0,
      time: "maintenant"
    };
    state.posts.unshift(newPost);
    renderPosts();
    toggleModal("post", false);
    form.reset();
    qs("[data-action='publish']")?.setAttribute("disabled", "true");
  });
}

function render() {
  renderStories();
  renderPosts();
  renderThreads();
  renderConversation();
}

function bootstrap() {
  initData();
  render();
  handleEvents();
}

document.addEventListener("DOMContentLoaded", bootstrap);

