function FeedbackBanner({ notice }) {
  if (!notice) return null

  return (
    <div className={`feedback-banner feedback-banner--${notice.type}`} role="status">
      <strong>{notice.title}</strong>
      <span>{notice.message}</span>
    </div>
  )
}

export default FeedbackBanner

