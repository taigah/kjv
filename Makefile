sgd: sgd.sh sgd.awk sgd.tsv
	cat sgd.sh > $@

	echo 'exit 0' >> $@

	echo '#EOF' >> $@
	tar czf - sgd.awk sgd.tsv >> $@

	chmod +x $@

test: sgd.sh
	shellcheck -s sh sgd.sh

.PHONY: test
