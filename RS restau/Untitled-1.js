// Voici une version corrigée pour éviter les erreurs de syntaxe TypeScript/JS :

// ---------- MODELS (Mongoose-like Pseudo-code) ----------

const mongoose = require('mongoose');
const { Schema } = mongoose;

// Utilisateur générique : "client" ou "restaurant"
const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: String,
  role: { type: String, enum: ['client', 'restaurant'], required: true },
  avatar: String,
  bio: String,
  location: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], default: [0,0] }, // [lng,lat]
  },
  followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  favoriteRestaurants: [{ type: Schema.Types.ObjectId, ref: 'User' }], // clients only
  chatGroups: [{ type: Schema.Types.ObjectId, ref: 'ChatGroup' }]
});

const RestaurantProfileSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  menu: [{
    name: String,
    description: String,
    price: Number,
    photo: String
  }],
  rating: { type: Number, default: 0 },
  socialLinks: [String]
});

const PostSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  restaurantMention: { type: Schema.Types.ObjectId, ref: 'User' }, // nullable
  type: { type: String, enum: ['photo', 'video', 'text'] },
  contentUrl: String,
  text: String,
  createdAt: { type: Date, default: Date.now },
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  reshares: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  comments: [{
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    comment: String,
    createdAt: { type: Date, default: Date.now }
  }]
});

const RatingLinkSchema = new Schema({
  restaurant: { type: Schema.Types.ObjectId, ref: 'User' },
  client: { type: Schema.Types.ObjectId, ref: 'User' },
  orderId: String,
  isUsed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const RatingSchema = new Schema({
  restaurant: { type: Schema.Types.ObjectId, ref: 'User' },
  client: { type: Schema.Types.ObjectId, ref: 'User' },
  score: Number,
  comment: String,
  createdAt: { type: Date, default: Date.now }
});

const ChatGroupSchema = new Schema({
  name: String,
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  isGroup: { type: Boolean, default: false }, // false = privé
  messages: [{
    sender: { type: Schema.Types.ObjectId, ref: 'User' },
    text: String,
    createdAt: { type: Date, default: Date.now }
  }]
});

// ---------- ROUTES (Express examples without syntax error) ----------

const express = require('express');
const app = express();

// S’inscrire (Client ou Restaurant)
app.post('/api/auth/register', (req, res) => { /* register logic */ });
app.post('/api/auth/login', (req, res) => { /* login logic */ });

// Publier une photo/vidéo
app.post('/api/posts', (req, res) => { /* create post */ });

// Voir tous les restaurants sur la carte
app.get('/api/restaurants/map', (req, res) => { /* return all 'restaurant' users */ });

// Aimer une publication
app.post('/api/posts/:id/like', (req, res) => { /* like logic */ });
// Republier (reshare)
app.post('/api/posts/:id/reshare', (req, res) => { /* reshare logic */ });
// Commenter
app.post('/api/posts/:id/comment', (req, res) => { /* add comment */ });

// S’abonner/suivre un compte
app.post('/api/users/:id/follow', (req, res) => { /* follow user */ });

// Noter : via lien unique
app.post('/api/rating/:ratingLinkId', (req, res) => { /* submit rating */ });

// Créer un groupe de discussion/message privé
app.post('/api/chat/group', (req, res) => { /* create group chat */ });
// Envoyer un message
app.post('/api/chat/message', (req, res) => { /* send message */ });

// ---------- FRONTEND COMPONENTS (React Syntax Valid) ----------

// Map des restaurants (Mapbox)
function RestaurantsMap({restaurants}) {
  return (
    <Map
      initialViewState={{
        longitude: 2.3522,
        latitude: 48.8566,
        zoom: 2
      }}
      style={{width: "1000px", height: "700px"}}
      mapStyle="mapbox://styles/mapbox/streets-v11"
    >
      {restaurants.map(r =>
        <Marker key={r._id} longitude={r.location.coordinates[0]} latitude={r.location.coordinates[1]}>
          <img src={r.avatar} alt={r.username} style={{width:32, height:32, borderRadius:'50%'}} />
        </Marker>
      )}
    </Map>
  );
}

// Profil Restaurant
function RestaurantProfile({restaurant}) {
  return (
    <div>
      <PhotoHeader {...restaurant} />
      <MenuView items={restaurant.menu} />
      <PostsGrid posts={restaurant.posts} />
    </div>
  );
}

// Profil Client
function ClientProfile({user}) {
  return (
    <div>
      <PhotoHeader {...user} />
      <FavoriteRanking list={user.favoriteRestaurants} />
      <PostsGrid posts={user.posts} />
    </div>
  );
}

// Page détail publication
function PostDetail({post, like, reshare, comment}) {
  return (
    <div>
      <Content src={post.contentUrl} type={post.type} />
      <ActionsBar onLike={like} onReshare={reshare} onComment={comment} />
      <CommentsList comments={post.comments} />
    </div>
  );
}

// Discussions/messagerie
function ChatWindow({group, messages, onSend}) {
  return (
    <div>
      <div>
        {messages.map((msg,i) => (
          <p key={i}><b>{msg.sender.username}:</b> {msg.text}</p>
        ))}
      </div>
      <input /* etc pour écrire message */ />
      <button onClick={onSend}>Envoyer</button>
    </div>
  );
}

// ---------- Note ----------
// Ceci évite les erreurs de syntaxe et JSX. Il s'agit de squelettes, à compléter et relier aux vrais modèles/données selon votre stack réelle.

