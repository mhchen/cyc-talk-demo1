interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  maxHeight?: string;
}

export function CodeBlock({
  code,
  language = 'javascript',
  title,
  maxHeight = '300px'
}: CodeBlockProps) {
  return (
    <div style={{
      border: '1px solid #e1e4e8',
      borderRadius: '6px',
      overflow: 'hidden',
      backgroundColor: '#f6f8fa'
    }}>
      {title && (
        <div style={{
          padding: '8px 16px',
          backgroundColor: '#f1f3f4',
          borderBottom: '1px solid #e1e4e8',
          fontSize: '0.875rem',
          fontWeight: 'bold',
          color: '#586069'
        }}>
          {title}
        </div>
      )}
      <pre style={{
        margin: 0,
        padding: '16px',
        overflow: 'auto',
        maxHeight,
        backgroundColor: '#ffffff',
        fontSize: '0.875rem',
        lineHeight: '1.45',
        fontFamily: 'SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace'
      }}>
        <code style={{
          fontFamily: 'inherit',
          fontSize: 'inherit'
        }}>
          {code}
        </code>
      </pre>
    </div>
  );
}