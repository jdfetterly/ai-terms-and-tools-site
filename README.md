# Generative AI Explained

An interactive Next.js application that serves as a comprehensive guide to Artificial Intelligence terminology. The AI Lexicon provides clear, accessible definitions of AI concepts with interactive tools and AI-powered examples to help users understand the rapidly evolving world of artificial intelligence.

## Features

- **📚 Comprehensive AI Terminology**: Organized collection of AI terms with detailed explanations
- **🎯 Multiple Learning Formats**: Simple definitions, analogies, examples, elaborations, and practical significance
- **🔧 Interactive Tools**: Embedded interactive tools and visualizations for hands-on learning
- **🤖 AI-Powered Examples**: Generate contextual examples using Genkit AI integration
- **🔍 Smart Search & Filtering**: Search terms by name or content, filter by categories
- **📱 Responsive Design**: Modern, mobile-friendly interface built with Tailwind CSS and shadcn/ui
- **💡 Community Driven**: Request new terms feature with email integration

## Tech Stack

- **Frontend**: [Next.js 15](https://nextjs.org/) with React 19 RC
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with [shadcn/ui](https://ui.shadcn.com/) components
- **AI Integration**: [Google Genkit](https://firebase.google.com/docs/genkit) for AI-powered features
- **Backend**: Firebase integration ready
- **Language**: TypeScript
- **Icons**: [Lucide React](https://lucide.dev/)

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- A Google AI API key (for Genkit AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd ai-lexicon
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```bash
   # Google AI API Key for Genkit
   GOOGLE_GENAI_API_KEY=your_google_ai_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:9002`

### Available Scripts

- `npm run dev` - Start development server on port 9002
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking
- `npm run genkit:dev` - Start Genkit development server
- `npm run genkit:watch` - Start Genkit with watch mode
- `npm test` - Run unit tests with Jest
- `npm run test:watch` - Run Jest in watch mode

## Adding and Updating Terms

### Understanding the Term Structure

Each term in the AI Lexicon follows a specific structure defined in `src/lib/types.ts`:

```typescript
interface Term {
  id: string;                    // Unique identifier (auto-generated)
  name: string;                  // Display name
  category: string;              // Category for organization
  content: TermContent;          // The main content
  interactiveTools?: InteractiveTool[]; // Optional interactive tools
}

interface TermContent {
  simpleDefinition: string;      // Required: Clear, concise explanation
  analogy?: string;              // Optional: Helpful comparison
  example?: string;              // Optional: Practical example
  elaboration?: string;          // Optional: Detailed explanation
  whyItMatters?: string;         // Optional: Significance and impact
}
```

### Adding a New Term

1. **Open the terms file**
   
   Navigate to `src/data/terms.ts` - this contains all term definitions.

2. **Add your term to the terms array**

   ```typescript
   {
     id: generateId('Your Term Name'),
     name: 'Your Term Name',
     category: 'Appropriate Category',
     content: {
       simpleDefinition: 'A clear, concise explanation of the term.',
       analogy: 'Optional: A helpful analogy or comparison.',
       example: 'Optional: A practical example showing the term in use.',
       elaboration: 'Optional: More detailed explanation with context and nuances.',
       whyItMatters: 'Optional: Why this term is significant in AI.',
     },
     interactiveTools: [ // Optional
       {
         name: 'Tool Name',
         url: 'https://example.com/tool',
         description: 'Brief description of what the tool does.'
       }
     ]
   },
   ```

3. **Choose the appropriate category**

   Current categories (defined in `src/data/terms.ts`):
   - `'Foundational Concepts'`
   - `'Interaction & Refinement'`
   - `'AI Architectures & Capabilities'`
   - `'Future & Research Landscape'`

   To add a new category, update the `categories` array at the bottom of the file.

### Content Guidelines

#### Simple Definition
- **Required field**
- Keep it concise (1-2 sentences)
- Use plain English, avoid jargon
- Focus on what the term actually means

#### Analogy
- Help users relate to familiar concepts
- Use everyday situations or objects
- Make abstract concepts concrete

#### Example
- Show the term in practical use
- Can be left empty to enable AI generation
- Include real-world applications when possible

#### Elaboration
- Provide deeper technical context
- Explain nuances and variations
- Include historical context if relevant

#### Why It Matters
- Explain the significance in AI/business
- Connect to broader implications
- Help users understand practical importance

### Interactive Tools

Interactive tools are displayed in modals and can enhance learning:

```typescript
interactiveTools: [
  {
    name: 'Descriptive Tool Name',
    url: 'https://example.com/interactive-tool',
    description: 'What users will learn or do with this tool.'
  }
]
```

**Guidelines for Interactive Tools:**
- Choose tools that directly illustrate the concept
- Ensure tools are maintained and accessible
- Provide clear descriptions of what users will experience
- Test tools work properly in iframe embedding

### Updating Existing Terms

1. **Locate the term** in `src/data/terms.ts`
2. **Edit the appropriate fields** while maintaining the structure
3. **Test your changes** by running the development server
4. **Verify formatting** by viewing the term in the application

### Content Formatting

All content fields support **Markdown formatting**:

- `**bold text**`
- `*italic text*`
- `` `code snippets` ``
- `[links](https://example.com)`
- Lists with `-` or `1.`
- Line breaks with double spaces or empty lines

### Best Practices

1. **Be Consistent**: Follow the existing style and tone
2. **Be Accessible**: Write for users new to AI
3. **Be Accurate**: Verify technical information
4. **Be Concise**: Respect users' time and attention
5. **Cross-Reference**: Link related terms using `**Term Name**` formatting
6. **Test Everything**: Verify your additions work properly

### Example: Adding a Complete Term

```typescript
{
  id: generateId('Neural Architecture Search (NAS)'),
  name: 'Neural Architecture Search (NAS)',
  category: 'AI Architectures & Capabilities',
  content: {
    simpleDefinition: 'An automated method for finding the best **Neural Network** architecture for a specific task, rather than designing it manually.',
    analogy: 'Like having an AI architect that designs the perfect building blueprint by trying thousands of different layouts and picking the most efficient one.',
    example: 'Google used NAS to automatically discover EfficientNet, which achieved better accuracy than manually designed networks while using fewer resources.',
    elaboration: 'NAS algorithms explore vast spaces of possible network architectures using techniques like reinforcement learning or evolutionary algorithms. This automation can discover novel architectures that human researchers might not consider, often leading to more efficient models.',
    whyItMatters: 'NAS democratizes neural network design and can lead to more efficient AI models, reducing the expertise barrier and computational costs for deploying AI systems.'
  },
  interactiveTools: [
    {
      name: 'NAS Visualizer',
      url: 'https://example.com/nas-tool',
      description: 'Interactive tool showing how different architectures are evaluated and selected.'
    }
  ]
}
```

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Main application page
│   ├── layout.tsx         # Root layout
│   ├── actions.ts         # Server actions
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── TermCard.tsx      # Term display component
│   ├── RequestTermDialog.tsx # Term request form
│   └── ...
├── data/
│   └── terms.ts          # All term definitions
├── lib/
│   └── types.ts          # TypeScript type definitions
├── ai/                   # Genkit AI integration
│   ├── genkit.ts         # AI configuration
│   └── flows/            # AI flow definitions
└── hooks/                # Custom React hooks
```

## Contributing

### Term Requests
Users can request new terms through the application interface, which generates an email with the term details.

### Development Contributions
1. Fork the repository
2. Create a feature branch
3. Add your terms/features following the guidelines above
4. Test thoroughly
5. Submit a pull request

### Content Guidelines
- Maintain political neutrality
- Use inclusive language
- Cite sources for complex technical claims
- Ensure content is appropriate for business/educational contexts

## Deployment

The application is configured for deployment on various platforms:

- **Vercel**: Automatic deployment with `vercel.json` configuration
- **Firebase**: Using `apphosting.yaml` for Firebase App Hosting
- **Other platforms**: Standard Next.js deployment process

## License

This project is private. Please respect the intellectual property and seek permission before using or distributing.

## Support

For questions, suggestions, or support:
- Email: jd@chatbotlabs.io
- LinkedIn: [@jdfetterly](https://linkedin.com/in/jdfetterly)
- Blog: [The Context Window](https://the-context-window.ghost.io/)

## Static Export Limitations

If you deploy this site as a static build (using `next export`), the "Generate Example with AI" feature will be disabled. This is because static exports do not support server actions or dynamic server-side logic.

### How to Enable AI Example Generation

- To enable AI example generation, deploy the site to a platform that supports serverless functions (such as Vercel, Netlify, or similar) and do not use `next export`.
- The UI will automatically detect static export mode using the `NEXT_PUBLIC_STATIC_EXPORT` environment variable. Set this variable to `true` at build time for static exports:

```sh
NEXT_PUBLIC_STATIC_EXPORT=true next build && next export
```

- For dynamic/serverless deployments, you can omit this variable or set it to `false`.

### Building for Static Deployment

To build for static deployment (like Cloudflare Pages), use:

```sh
npm run build:static
```

This command temporarily moves server action files during the build process to ensure compatibility with static export.

### Cloudflare Pages Setup

When setting up Cloudflare Pages, use these build settings:

- **Framework preset:** Next.js (Static HTML Export)
- **Build command:** `npm run build:static`
- **Output directory:** `out`
- **Environment variable:** `NEXT_PUBLIC_STATIC_EXPORT=true`

---

*Built with ❤️ by JD | [ChatBotLabs.io](https://chatbotlabs.io)*
# Trigger Cloudflare rebuild
