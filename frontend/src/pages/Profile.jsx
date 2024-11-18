import React from 'react';

const Profile = ({ user }) => {
  return (
    <div className="profile-page p-4">
      <div className="profile-header flex items-center gap-4">
        <img
          src={user.profilePicture}
          alt="Profile"
          className="w-16 h-16 rounded-full"
        />
        <div>
          <h2 className="text-xl font-bold">{user.name}</h2>
          <p>{user.bio}</p>
        </div>
      </div>
      <h3 className="mt-6 text-lg font-semibold">Posts</h3>
      <div className="posts">
        {user.posts.map((post) => (
          <div key={post.id} className="post-card bg-white p-4 shadow rounded-lg mb-4">
            <h4 className="font-semibold">{post.title}</h4>
            <p>{post.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
