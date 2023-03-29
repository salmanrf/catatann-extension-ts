interface UserContainerProps {
  user: any;
}

export function UserContainer({ user }: UserContainerProps) {
  return (
    <div id="ctnn-user-container">
      <div class="user-picture">
        <img src="${() => user.picture_url}" alt="user-profile-picture" />
      </div>
      <div class="user-name">{user.full_name}</div>
    </div>
  );
}
