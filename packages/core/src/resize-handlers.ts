import type { ResizeContext } from "~/type";

/**
 * Resize handler that scrolls to restore the iframe's position in the viewport as it was before the resize.
 *
 * *Note:* This behavior only triggers if the iframe is currently being hovered by the user,
 * in order to try to limit the number of scroll as it can affect the user experience.
 */
export const updateParentScrollOnResize = ({ previousRenderState, nextRenderState, interactionState }: ResizeContext) => {
  if (interactionState.isHovered) {
    window.scrollBy(0, nextRenderState.rect.bottom - previousRenderState.rect.bottom);
  }
};
