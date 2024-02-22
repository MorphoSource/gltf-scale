import { getBounds } from '@gltf-transform/core';

const NAME = 'scale';

/**
 * Centers the {@link Scene} at the origin, or above/below it. Transformations from animation,
 * skinning, and morph targets are not taken into account.
 *
 * Example:
 *
 * ```ts
 * await document.transform(center({pivot: 'below'}));
 * ```
 *
 * @category Transforms
 */
export function scale(options = {factor: 1.0}) {
  return (document) => {
    const factor = parseFloat(options.factor);
    const factorVec = [factor, factor, factor];

    const logger = document.getLogger();
    const root = document.getRoot();
    const isAnimated = root.listAnimations().length > 0 || root.listSkins().length > 0;

    document.getRoot()
      .listScenes()
      .forEach((scene, index) => {
        logger.debug(`${NAME}: Scene ${index + 1} / ${root.listScenes().length}.`);

        if (isAnimated) {
          logger.debug(`${NAME}: Model contains animation or skin. Adding a wrapper node.`);
          const scaleNode = document.createNode('Scale').setScale(factorVec);
          scene.listChildren().forEach((child) => scaleNode.addChild(child));
          scene.addChild(scaleNode);
        } else {
          logger.debug(`${NAME}: Skipping wrapper, scaling all root nodes.`);
          scene.listChildren().forEach((child) => {
            const s = child.getScale();
            child.setScale([s[0] * factorVec[0], s[1] * factorVec[1], s[2] * factorVec[2]]);
          });
        }
      });

    logger.debug(`${NAME}: Complete.`);
  };
}
