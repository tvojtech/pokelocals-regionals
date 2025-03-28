import { ImportRk9TournamentTaskResult } from "~/types";

export function categorizeDeck(
  decklist: ImportRk9TournamentTaskResult["players"][number]["decklist"]
) {
  const deckCards = decklist.data
    .map((card) => ({
      cardName: card.cardName.toLocaleLowerCase(),
      setNumber: card.setNumber.toLocaleLowerCase(),
      quantity: parseInt(card.quantity),
    }))
    .reduce(
      (acc, { cardName, setNumber, quantity }) => ({
        ...acc,
        [cardName]: {
          cardName,
          quantity: (acc[cardName]?.quantity ?? 0) + quantity,
          setNumbers: [...(acc[cardName]?.setNumbers ?? []), setNumber],
        },
      }),
      {} as Record<
        string,
        { cardName: string; quantity: number; setNumbers: string[] }
      >
    );

  const cards = Object.values(deckCards);

  if (cards.some((card) => card.cardName === "lugia v")) {
    return "Lugia";
  }
  if (cards.some((card) => card.cardName === "regidrago v")) {
    return "Regidrago";
  }
  if (cards.some((card) => card.cardName === "raging bolt ex")) {
    return "Raging_Bolt";
  }

  if (cards.some((card) => card.cardName === "dragapult ex")) {
    if (cards.some((card) => card.cardName === "dusknoir")) {
      return "Dragapult_Dusknoir";
    }
    return "Dragapult";
  }

  if (cards.some((card) => card.cardName === "charizard ex")) {
    if (cards.some((card) => card.cardName === "dusknoir")) {
      return "Charizard_Dusknoir";
    }
    return "Charizard";
  }

  if (cards.some((card) => card.cardName === "gholdengo ex")) {
    return "Gholdengo";
  }

  if (cards.some((card) => card.cardName === "gardevoir ex")) {
    return "Gardevoir";
  }
  if (cards.some((card) => card.cardName === "archaludon ex")) {
    return "Archaludon";
  }
  if (
    cards.some(
      (card) =>
        card.cardName === "comfey" &&
        card.setNumbers.every(
          (set) => set.startsWith("lor") || set === "pr-swsh242"
        ) &&
        card.quantity > 1
    )
  ) {
    return "Lost_Box";
  }

  if (
    cards.some(
      (card) =>
        card.cardName === "snorlax" &&
        card.setNumbers.every((set) => set.startsWith("pgo")) &&
        card.quantity > 1
    )
  ) {
    return "Snorlax_stall";
  }

  if (
    cards.some(
      (card) =>
        card.cardName === "pidgeot ex" &&
        card.setNumbers.every(
          (set) => set.startsWith("obf") || set.startsWith("paf")
        ) &&
        card.quantity > 1
    ) &&
    cards.some((card) => card.cardName === "luxray v")
  ) {
    return "Pidgeot_control";
  }

  if (
    cards.some((card) => card.cardName === "miraidon ex" && card.quantity > 1)
  ) {
    return "Miraidon";
  }

  if (cards.some((card) => card.cardName === "klawf" && card.quantity >= 3)) {
    return "Klafw";
  }

  if (
    cards.some((card) => card.cardName === "klawf") &&
    cards.some((card) => card.cardName === "terapagos ex")
  ) {
    return "Klafw_Terapagos";
  }

  if (
    cards.some((card) => card.cardName === "terapagos ex" && card.quantity >= 3)
  ) {
    return "Terapagos";
  }

  if (cards.some((card) => card.cardName === "palkia v")) {
    return "Palkia";
  }

  if (
    cards.some(
      (card) => card.cardName === "roaring moon ex" && card.quantity >= 3
    )
  ) {
    return "Roaring_Moon";
  }

  if (
    cards.some((card) => card.cardName === "roaring moon" && card.quantity >= 4)
  ) {
    return "Ancient_box";
  }

  return "Other";
}
