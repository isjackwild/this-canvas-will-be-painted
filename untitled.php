<div class="pop-in__content">
	<h6 class="pop-in__title back-to-parent">
		<a href="<?= $page->parent()->url() ?>"><img class="ui--back-arrow" src="<?= url('assets/images/nav--back--grey.svg') ?>" /> Back to tickets</a>
	</h6>
	<h3 class="info-post__small-title small-title">STEP 2 of 3</h3>
	<h2 class="info-post__large-title large-title partners__title"><?= $data->subtitle()->html() ?></h2>
	<div class="body-copy"><?= $page->bodycopy1()->kt() ?></div>

	<ul class="ticket-options">
		<?php foreach($page->ticketoptions()->toStructure() as $ticketoption): ?>
			<li class="ticket-options__option">
				<a
					class="info-section__button info-section__button--filled widget"
					ontouchstart=""
					href="<?= $ticketoption->link()->url() ?>"
				><?= $ticketoption->title()->html() ?></a>
				<?php if ($ticketoption->infotext()->isNotEmpty()): ?>
					<h6 class="info-section__button-tagline body-copy"><?= $ticketoption->infotext()->html() ?></h6>
				<?php endif; ?>
			</li>
		<?php endforeach; ?>
	</ul>

	<div class="body-copy"><?= $page->bodycopy2()->kt() ?></div>
	<div class="body-copy-small"><?= $page->footercopy()->kt() ?></div>
</div>