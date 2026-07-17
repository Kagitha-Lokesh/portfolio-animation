import React from 'react';
import GlassCard from '../../../shared/ui/GlassCard';
import Chip from '../../../shared/ui/Chip';
import Heading from '../../../shared/ui/Heading';
import { StaggerIn, StaggerItem } from '../../../shared/motion/MotionProvider';
import './SkillCluster.css';

export function SkillCluster({ category, theme = 'dark' }) {
  if (!category) return null;

  return (
    <GlassCard theme={theme} className="skill-cluster-card">
      <Heading level={3} className="skill-cluster-title">
        <span className="cluster-bullet">●</span> {category.label}
      </Heading>
      
      <StaggerIn className="cluster-chips-container" stagger={0.06}>
        {category.items.map((item, index) => (
          <StaggerItem key={index} y={12} className="cluster-chip-wrapper">
            <Chip className="cluster-skill-chip">{item}</Chip>
          </StaggerItem>
        ))}
      </StaggerIn>
    </GlassCard>
  );
}

export default SkillCluster;
