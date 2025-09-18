import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export interface HeroContent {
  title: string;
  subtitle: string;
  buttonText: string;
  backgroundImage: string;
}

export interface BenefitItem {
  id: string;
  icon: string;
  title: string;
  description: string;
  order: number;
}

export interface ProjectInfoContent {
  title: string;
  subtitle: string;
  description: string;
  features: ProjectFeature[];
}

export interface ProjectFeature {
  id: string;
  icon: string;
  title: string;
  description: string;
  iconColor: string;
  order: number;
}

export interface HomepageContent {
  id: string;
  hero: HeroContent;
  benefits: BenefitItem[];
  projectInfo: ProjectInfoContent;
  updatedAt?: Date;
}

const defaultContent: HomepageContent = {
  id: 'homepage',
  hero: {
    title: 'Paradise Green Park Apartments',
    subtitle: 'Луксозни апартаменти за продажба с изглед към морето в престижния комплекс в Златни пясъци',
    buttonText: 'Виж апартаментите',
    backgroundImage: 'https://firebasestorage.googleapis.com/v0/b/paradise-fbb21.firebasestorage.app/o/media%2F1758179336080_DSC_0688.JPG?alt=media&token=81332077-bde8-432c-9b95-daae219664ac'
  },
  benefits: [
    {
      id: '1',
      icon: 'Waves',
      title: 'Басейн с морска вода',
      description: 'Открит басейн с подгрявана морска вода и детска секция',
      order: 1
    },
    {
      id: '2',
      icon: 'Utensils',
      title: 'Ресторант & Бар',
      description: 'Изискан ресторант с международна кухня и коктейл бар',
      order: 2
    },
    {
      id: '3',
      icon: 'TreePine',
      title: 'СПА & Уелнес център',
      description: 'Пълноценен СПА център с масажи и релаксиращи процедури',
      order: 3
    },
    {
      id: '4',
      icon: 'Shield',
      title: 'Сигурност 24/7',
      description: 'Денонощна охрана, видеонаблюдение и контролиран достъп',
      order: 4
    },
    {
      id: '5',
      icon: 'Car',
      title: 'Подземен паркинг',
      description: 'Охраняеми паркоместа в подземен гараж за всички собственици',
      order: 5
    },
    {
      id: '6',
      icon: 'Dumbbell',
      title: 'Фитнес център',
      description: 'Модерна фитнес зала с професионално оборудване',
      order: 6
    }
  ],
  projectInfo: {
    title: 'Луксозен живот',
    subtitle: 'край морето',
    description: 'Paradise Green Park предлага уникално съчетание от модерен комфорт, природна красота и морско спокойствие в сърцето на Златни пясъци',
    features: [
      {
        id: '1',
        icon: 'Building2',
        title: 'Архитектура',
        description: 'Модерна архитектура с панорамни прозорци и просторни тераси с изглед към морето',
        iconColor: 'text-primary',
        order: 1
      },
      {
        id: '2',
        icon: 'Waves',
        title: 'Басейн & СПА',
        description: 'Външен басейн с морска вода, джакузи и пълноценен СПА център за релакс',
        iconColor: 'text-blue-500',
        order: 2
      },
      {
        id: '3',
        icon: 'TreePine',
        title: 'Градини',
        description: 'Ландшафтни градини с тропически растения и зони за отдих сред природата',
        iconColor: 'text-green-500',
        order: 3
      },
      {
        id: '4',
        icon: 'Utensils',
        title: 'Ресторант',
        description: 'Изискан ресторант с международна кухня и специалитети от морски дарове',
        iconColor: 'text-amber-500',
        order: 4
      },
      {
        id: '5',
        icon: 'Shield',
        title: 'Сигурност',
        description: 'Денонощна охрана, контролиран достъп и видеонаблюдение в целия комплекс',
        iconColor: 'text-red-500',
        order: 5
      },
      {
        id: '6',
        icon: 'Wifi',
        title: 'Удобства',
        description: 'Безплатен WiFi, фитнес зала, детска площадка и бизнес център',
        iconColor: 'text-purple-500',
        order: 6
      }
    ]
  }
};

export const useHomepageContent = () => {
  const [content, setContent] = useState<HomepageContent>(defaultContent);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const docRef = doc(db, 'content', 'homepage');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        // Ensure all required properties exist with fallbacks
        const safeData = {
          ...data,
          hero: data.hero || defaultContent.hero,
          benefits: Array.isArray(data.benefits) ? data.benefits : defaultContent.benefits,
          projectInfo: {
            ...defaultContent.projectInfo,
            ...data.projectInfo,
            features: Array.isArray(data.projectInfo?.features) ? data.projectInfo.features : defaultContent.projectInfo.features
          }
        };
        
        setContent({
          id: docSnap.id,
          ...safeData,
          updatedAt: data.updatedAt?.toDate()
        } as HomepageContent);
      } else {
        // Create default content if it doesn't exist
        await saveContent(defaultContent);
        setContent(defaultContent);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching homepage content:', err);
      setError('Грешка при зареждане на съдържанието');
      setContent(defaultContent);
    } finally {
      setLoading(false);
    }
  };

  const saveContent = async (newContent: HomepageContent) => {
    try {
      const docRef = doc(db, 'content', 'homepage');
      const contentData = {
        ...newContent,
        updatedAt: serverTimestamp()
      };
      
      await setDoc(docRef, contentData);
      setContent({ ...newContent, updatedAt: new Date() });
      return true;
    } catch (err) {
      console.error('Error saving homepage content:', err);
      setError('Грешка при запазване на съдържанието');
      return false;
    }
  };

  const updateHero = async (heroData: Partial<HeroContent>) => {
    const updatedContent = {
      ...content,
      hero: { ...content.hero, ...heroData }
    };
    return await saveContent(updatedContent);
  };

  const updateProjectInfo = async (projectInfoData: Partial<ProjectInfoContent>) => {
    const updatedContent = {
      ...content,
      projectInfo: { ...content.projectInfo, ...projectInfoData }
    };
    return await saveContent(updatedContent);
  };

  const updateProjectFeature = async (featureId: string, featureData: Partial<ProjectFeature>) => {
    const updatedFeatures = content.projectInfo.features.map(feature =>
      feature.id === featureId ? { ...feature, ...featureData } : feature
    );
    const updatedContent = {
      ...content,
      projectInfo: { ...content.projectInfo, features: updatedFeatures }
    };
    return await saveContent(updatedContent);
  };

  const addProjectFeature = async (featureData: Omit<ProjectFeature, 'id' | 'order'>) => {
    const newFeature: ProjectFeature = {
      ...featureData,
      id: Date.now().toString(),
      order: content.projectInfo.features.length + 1
    };
    const updatedContent = {
      ...content,
      projectInfo: {
        ...content.projectInfo,
        features: [...content.projectInfo.features, newFeature]
      }
    };
    return await saveContent(updatedContent);
  };

  const removeProjectFeature = async (featureId: string) => {
    const updatedFeatures = content.projectInfo.features
      .filter(feature => feature.id !== featureId)
      .map((feature, index) => ({ ...feature, order: index + 1 }));
    
    const updatedContent = {
      ...content,
      projectInfo: { ...content.projectInfo, features: updatedFeatures }
    };
    return await saveContent(updatedContent);
  };

  const reorderProjectFeatures = async (features: ProjectFeature[]) => {
    const updatedContent = {
      ...content,
      projectInfo: {
        ...content.projectInfo,
        features: features.map((feature, index) => ({ ...feature, order: index + 1 }))
      }
    };
    return await saveContent(updatedContent);
  };
  const updateBenefit = async (benefitId: string, benefitData: Partial<BenefitItem>) => {
    const updatedBenefits = content.benefits.map(benefit =>
      benefit.id === benefitId ? { ...benefit, ...benefitData } : benefit
    );
    const updatedContent = {
      ...content,
      benefits: updatedBenefits
    };
    return await saveContent(updatedContent);
  };

  const addBenefit = async (benefitData: Omit<BenefitItem, 'id' | 'order'>) => {
    const newBenefit: BenefitItem = {
      ...benefitData,
      id: Date.now().toString(),
      order: content.benefits.length + 1
    };
    const updatedContent = {
      ...content,
      benefits: [...content.benefits, newBenefit]
    };
    return await saveContent(updatedContent);
  };

  const removeBenefit = async (benefitId: string) => {
    const updatedBenefits = content.benefits
      .filter(benefit => benefit.id !== benefitId)
      .map((benefit, index) => ({ ...benefit, order: index + 1 }));
    
    const updatedContent = {
      ...content,
      benefits: updatedBenefits
    };
    return await saveContent(updatedContent);
  };

  const reorderBenefits = async (benefits: BenefitItem[]) => {
    const updatedContent = {
      ...content,
      benefits: benefits.map((benefit, index) => ({ ...benefit, order: index + 1 }))
    };
    return await saveContent(updatedContent);
  };

  useEffect(() => {
    fetchContent();
  }, []);

  return {
    content,
    loading,
    error,
    updateHero,
    updateProjectInfo,
    updateProjectFeature,
    addProjectFeature,
    removeProjectFeature,
    reorderProjectFeatures,
    updateBenefit,
    addBenefit,
    removeBenefit,
    reorderBenefits,
    refreshContent: fetchContent
  };
};