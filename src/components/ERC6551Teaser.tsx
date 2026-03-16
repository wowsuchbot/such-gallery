// ERC-6551 Teaser - Banner announcing upcoming NFT galleries

export function ERC6551Teaser() {
  return (
    <section className="border border-black dark:border-white bg-gray-50 dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-6 py-8 text-center">
        <p className="font-mono text-xs uppercase tracking-wider text-gray-500 mb-2">
          Coming Soon
        </p>
        <h2 className="font-serif text-2xl md:text-3xl font-bold">
          Galleries as NFTs
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-3 max-w-xl mx-auto">
          Each gallery will become an ERC-6551 token-bound account.
          Own the curation. Trade the collection.
        </p>
        <p className="font-mono text-xs text-gray-400 mt-4">
          ERC-6551 · Token-Bound Accounts · Base
        </p>
      </div>
    </section>
  );
}
