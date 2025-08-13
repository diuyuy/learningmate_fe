export default function VideoPlayer() {
  const src = 'https://www.youtube.com/embed/vbjLJnlB2kg';

  return (
    <article className='w-4/5 h-full'>
      <figure className='aspect-video'>
        <iframe
          src={src}
          title='Video Player'
          className='w-full h-full rounded-2xl shadow-md'
          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
          allowFullScreen
        />
      </figure>
    </article>
  );
}
