/*
 * ── Projects Data ──────────────────────────────────
 *
 * Add your projects here. Each needs:
 *   - title: Project name
 *   - url: Link to repo or live site
 *   - img: Filename in /public/assets/images/projects/
 *   - category: 'fullstack' | 'ml' | 'systems' | 'web' | 'other'
 *   - description: Short blurb
 *   - tech: Array of tech used
 *
 * Images go in: public/assets/images/projects/
 * ────────────────────────────────────────────────────
 */

export const PROJECTS = [
  {
    title: 'Payment Gateway Microservices',
    url: 'https://github.com/MOYOSOREJOBI',
    img: 'project-01.jpg',
    category: 'fullstack',
    description: 'Distributed microservices payment gateway with event-driven architecture',
    tech: ['Python', 'FastAPI', 'Kafka', 'PostgreSQL', 'Docker'],
    likes: 86,
    views: 2400,
  },
  {
    title: 'Real-Time Telemetry System',
    url: 'https://github.com/MOYOSOREJOBI',
    img: 'project-02.jpg',
    category: 'systems',
    description: 'Solar car telemetry dashboard for UCalgary Solar Racing Team',
    tech: ['C++', 'Python', 'React', 'WebSocket', 'InfluxDB'],
    likes: 124,
    views: 3800,
  },
  {
    title: 'ML Analytics Platform',
    url: 'https://github.com/MOYOSOREJOBI',
    img: 'project-03.jpg',
    category: 'ml',
    description: 'End-to-end ML pipeline for sports performance analytics',
    tech: ['PyTorch', 'BERT', 'FastAPI', 'React', 'AWS'],
    likes: 97,
    views: 3200,
  },
  {
    title: 'FPL Optimizer',
    url: 'https://github.com/MOYOSOREJOBI',
    img: 'project-04.jpg',
    category: 'ml',
    description: 'Fantasy Premier League squad optimization using ML predictions',
    tech: ['Python', 'scikit-learn', 'pandas', 'React'],
    likes: 210,
    views: 5600,
  },
  {
    title: 'Cloud Architecture Dashboard',
    url: 'https://github.com/MOYOSOREJOBI',
    img: 'project-05.jpg',
    category: 'fullstack',
    description: 'AWS infrastructure monitoring with 4x certified expertise',
    tech: ['AWS', 'Terraform', 'React', 'Node.js', 'GraphQL'],
    likes: 73,
    views: 1900,
  },
  {
    title: 'CNN Image Classifier',
    url: 'https://github.com/MOYOSOREJOBI',
    img: 'project-06.jpg',
    category: 'ml',
    description: 'Convolutional neural network for multi-class image classification',
    tech: ['PyTorch', 'CNN', 'Python', 'Matplotlib'],
    likes: 54,
    views: 1600,
  },
];

/* Add more projects following the same format */
