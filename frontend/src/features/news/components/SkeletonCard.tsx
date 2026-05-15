// src/features/news/components/SkeletonCard.tsx

export default function SkeletonCard({ featured = false }: { featured?: boolean }) {
  return (
    <div style={{
      background:   '#0D1B2A',
      border:       '1px solid rgba(255,255,255,0.06)',
      borderRadius: 10,
      overflow:     'hidden',
      height:       featured ? 420 : 320,
    }}>
      <div style={{
        height:     featured ? 220 : 160,
        background: 'rgba(255,255,255,0.04)',
        animation:  'shimmer 1.5s ease-in-out infinite',
      }} />
      <div style={{ padding: '16px' }}>
        <div style={{ height:12, width:'40%', background:'rgba(255,255,255,0.06)', borderRadius:4, marginBottom:10, animation:'shimmer 1.5s ease-in-out infinite 0.1s' }} />
        <div style={{ height:18, width:'90%', background:'rgba(255,255,255,0.06)', borderRadius:4, marginBottom:8,  animation:'shimmer 1.5s ease-in-out infinite 0.2s' }} />
        <div style={{ height:18, width:'70%', background:'rgba(255,255,255,0.06)', borderRadius:4, marginBottom:12, animation:'shimmer 1.5s ease-in-out infinite 0.3s' }} />
        <div style={{ height:12, width:'50%', background:'rgba(255,255,255,0.04)', borderRadius:4, animation:'shimmer 1.5s ease-in-out infinite 0.4s' }} />
      </div>
      <style>{`
        @keyframes shimmer {
          0%,100% { opacity:0.4; }
          50%      { opacity:0.8; }
        }
      `}</style>
    </div>
  )
}