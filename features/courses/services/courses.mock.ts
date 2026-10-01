import { Course, CourseDetail } from "../types/course";

export const mockCourses: Course[] = [
  {
    id: "1",
    title: "Arquitetura de Sistemas Táticos & Distribuídos",
    category: "Engenharia de Software",
    shortDescription: "Domine microsserviços resilientes, mensageria de alta vazão e tolerância a falhas para missões de alta criticidade.",
    thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80",
    modulesCount: 6,
  },
  {
    id: "2",
    title: "Defesa Cibernética e Análise Forense de Redes",
    category: "Cibersegurança",
    shortDescription: "Protocolos de criptografia quântica, contenção de intrusões ativas e monitoramento de tráfego em tempo real.",
    thumbnail: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80",
    modulesCount: 4,
  },
  {
    id: "3",
    title: "Engenharia de Inteligência Operacional & IA",
    category: "Inteligência Artificial",
    shortDescription: "Implementação de modelos de visão computacional, telemetria autônoma e pipelines neurais industriais.",
    thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80",
    modulesCount: 5,
  },
  {
    id: "4",
    title: "Computação em Nuvem Tática & Kubernetes",
    category: "DevOps & Cloud",
    shortDescription: "Orquestração de clusters militares isolados, automação com Terraform e observabilidade avançada.",
    thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80",
    modulesCount: 3,
  },
];

export const mockCourseDetails: Record<string, CourseDetail> = {
  "1": {
    id: "1",
    title: "Arquitetura de Sistemas Táticos & Distribuídos",
    category: "Engenharia de Software",
    description: "Um programa imersivo projetado para engenheiros seniores construírem infraestruturas de missão crítica com tolerância a particionamento de rede, consenso distribuído e latência ultrabaixa.",
    thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80",
    modules: [
      {
        id: "m1",
        title: "Protocolos de Consenso e Topologia de Nós",
        order: 1,
        lessons: [
          { id: "l1", title: "Fundamentos do Algoritmo Raft e Paxos", order: 1, status: "completed", duration: "42 min" },
          { id: "l2", title: "Detecção de Falhas e Particionamento de Rede", order: 2, status: "completed", duration: "55 min" },
          { id: "l3", title: "Quórum Distribuído em Ambientes Hostis", order: 3, status: "in_progress", duration: "38 min" },
        ],
      },
      {
        id: "m2",
        title: "Mensageria Resiliente & Event Sourcing",
        order: 2,
        lessons: [
          { id: "l4", title: "Topologia de Tópicos Kafka com Isolamento Tático", order: 1, status: "available", duration: "50 min" },
          { id: "l5", title: "Idempotência e Garantia Exactly-Once", order: 2, status: "available", duration: "48 min" },
          { id: "l6", title: "Recuperação de Estado com Snapshots Criptografados", order: 3, status: "available", duration: "64 min" },
        ],
      },
      {
        id: "m3",
        title: "Sistemas em Memória e Cache Replicado",
        order: 3,
        lessons: [
          { id: "l7", title: "Consistência Eventual e CRDTs", order: 1, status: "locked", duration: "45 min" },
          { id: "l8", title: "Mitigação de Cache Stampede e Thundering Herd", order: 2, status: "locked", duration: "40 min" },
        ],
      },
    ],
  },
  "2": {
    id: "2",
    title: "Defesa Cibernética e Análise Forense de Redes",
    category: "Cibersegurança",
    description: "Operações táticas de contenção de ameaças persistentes avançadas (APT), criptoanálise defensiva e resposta a incidentes de infraestrutura crítica.",
    thumbnail: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80",
    modules: [
      {
        id: "m1",
        title: "Vetor de Ataque e Triagem Inicial",
        order: 1,
        lessons: [
          { id: "l1", title: "Inspeção Profunda de Pacotes (DPI) em Alta Velocidade", order: 1, status: "completed", duration: "35 min" },
          { id: "l2", title: "Decodificação de Payloads Maliciosos", order: 2, status: "available", duration: "50 min" },
        ],
      },
      {
        id: "m2",
        title: "Hardening de Kernels e Isolamento Operacional",
        order: 2,
        lessons: [
          { id: "l3", title: "Implementação de Políticas SELinux e AppArmor", order: 1, status: "available", duration: "60 min" },
          { id: "l4", title: "Criação de Sandboxes Criptografados", order: 2, status: "locked", duration: "45 min" },
        ],
      },
    ],
  },
  "3": {
    id: "3",
    title: "Engenharia de Inteligência Operacional & IA",
    category: "Inteligência Artificial",
    description: "Pipelines avançados de processamento de sinais, modelos embarcados para robótica autônoma e inferência de baixa latência em hardware industrial.",
    thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80",
    modules: [
      {
        id: "m1",
        title: "Modelos Neurais Embarcados",
        order: 1,
        lessons: [
          { id: "l1", title: "Quantização INT8 e Otimização com TensorRT", order: 1, status: "completed", duration: "40 min" },
          { id: "l2", title: "Visão Computacional para Reconhecimento Tático", order: 2, status: "available", duration: "55 min" },
        ],
      },
    ],
  },
  "4": {
    id: "4",
    title: "Computação em Nuvem Tática & Kubernetes",
    category: "DevOps & Cloud",
    description: "Estratégias de deploy distribuído em multi-região geográfica, orquestração autônoma e clusters auto-recuperáveis em situações de pane.",
    thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80",
    modules: [
      {
        id: "m1",
        title: "Provisionamento Imutável de Infraestrutura",
        order: 1,
        lessons: [
          { id: "l1", title: "Arquetipagem com Terraform e OpenTofu", order: 1, status: "available", duration: "45 min" },
          { id: "l2", title: "Configuração de Redes Mesh com Cilium e eBPF", order: 2, status: "available", duration: "60 min" },
        ],
      },
    ],
  },
};

// Fallback para detalhe padrão caso o ID não conste no dicionário
export const mockCourseDetail: CourseDetail = mockCourseDetails["1"];
